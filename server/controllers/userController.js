const EWaste = require('../models/ewaste');
const Redemption = require('../models/redemption');
const User = require('../models/user');
const Reward = require('../models/rewards');
const Badge = require('../models/badge');

// Update user rank based on badges
const updateUserRank = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return null;

        // Get all badges and sort by points required
        const badges = await Badge.find().sort({ pointsRequired: -1 });
        
        // Find the highest badge the user qualifies for
        let highestBadge = null;
        for (const badge of badges) {
            if (user.exp >= badge.pointsRequired) {
                highestBadge = badge;
                break;
            }
        }

        // Update user's rank if they have a qualifying badge
        if (highestBadge) {
            user.rank = highestBadge.name;
            await user.save();
        }

        return user;
    } catch (err) {
        console.error('Error updating user rank:', err);
        return null;
    }
};

// Submit EWaste :user
const submitEWaste = async (req, res) => {
    try {
        const { userId, category } = req.body;
        const attachments = req.files.map(file => ({
            name: file.originalname,
            path: file.path,
        }));

        const newSubmission = new EWaste({
            user: userId,
            category,
            attachments,
        });

        await newSubmission.save();

        res.status(201).json({ message: "E-Waste submitted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to submit e-waste" });
    }
};

// Get user submit count
const userSubmitCount = async (req, res) => {
    try {
        const { userId } = req.params;
        // Count the number of submissions for the given user
        const count = await EWaste.countDocuments({ user: userId });

        res.status(200).json({ submissionCount: count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch submission count" });
    }
};

// Get submissions by user :user
const getUserSubmissions = async (req, res) => {
    try {
        const { userId } = req.params;
        const submissions = await EWaste.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(submissions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch submissions" });
    }
};

// Redeem reward :user
const redeemReward = async (req, res) => {
    try {
        const { userId, rewardId } = req.body;

        // Find the user and reward
        const user = await User.findById(userId);
        const reward = await Reward.findById(rewardId);

        if (!user || !reward) {
            return res.status(404).json({ message: "User or reward not found" });
        }

        // Check if user has enough points
        if (user.points < reward.pointsCost) {
            return res.status(400).json({ message: "Insufficient points" });
        }

        // Create redemption record
        const redemption = new Redemption({
            userId,
            rewardId,
            rewardName: reward.name,
            redemptionDate: new Date()
        });

        // Update user points
        user.points -= reward.points;

        // Save both redemption and updated user points
        await Promise.all([
            redemption.save(),
            user.save()
        ]);

        res.status(201).json({ 
            message: "Reward redeemed successfully",
            remainingPoints: user.points
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to redeem reward" });
    }
};

module.exports = {
    submitEWaste,
    userSubmitCount,
    getUserSubmissions,
    redeemReward,
    updateUserRank
};
