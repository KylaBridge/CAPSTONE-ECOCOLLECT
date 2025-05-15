const User = require('../models/user');
const EWaste = require('../models/ewaste');
const Reward = require('../models/rewards');
const path = require("path");
const fs = require("fs");
const { getRank } = require('../helpers/rank');

// GET all ewastes with approved status
const getEwastes = async (req, res) => {
    try {
        const telephoneCount = await EWaste.countDocuments({ category: "Telephone", status: "Approved" });
        const routerCount = await EWaste.countDocuments({ category: "Router", status: "Approved" });
        const mobileCount = await EWaste.countDocuments({ category: "Mobile Phone", status: "Approved" });
        const tabletCount = await EWaste.countDocuments({ category: "Tablet", status: "Approved" });
        const laptopCount = await EWaste.countDocuments({ category: "Laptop", status: "Approved" });
        const chargerCount = await EWaste.countDocuments({ category: "Charger", status: "Approved" });
        const batteryCount= await EWaste.countDocuments({ category: "Batteries", status: "Approved" });
        const cordCount = await EWaste.countDocuments({ category: "Cords", status: "Approved" });
        const powerbankCount = await EWaste.countDocuments({ category: "Powerbank", status: "Approved" });
        const usbCount = await EWaste.countDocuments({ category: "USB", status: "Approved" });

        res.status(200).json({
            telephoneCount, routerCount,
            mobileCount, tabletCount,
            laptopCount, chargerCount,
            batteryCount, cordCount,
            powerbankCount,usbCount
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed fetching ewastes" });
    }
}

// GET all users
const getUserData = async (req, res) => {
    const data = await User.find({});
    res.status(200).json(data);
};

// Count users by role 
const countUsersByRole = async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: "user" });
        const adminCount = await User.countDocuments({ role: "admin" });

        res.status(200).json({
            userCount,
            adminCount,
        });
    } catch (error) {
        console.error("Error counting roles:", error);
        res.status(500).json({ message: "Failed to count roles" });
    }
};

// DELETE user :admin
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

// Update submission status 
const updateSubmissionStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const submission = await EWaste.findById(id);

        if (!submission) return res.status(404).json({ message: "Submission not found" });

        // If status changes from "Pending", delete image files
        if (status !== "Pending" && submission.attachments.length > 0) {
            submission.attachments.forEach((file) => {
                const filePath = path.join(__dirname, "..", file.path);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Delete the file
                }
            });

            // Clear the attachments array in the DB
            submission.attachments = [];
        }

        // Update the status
        submission.status = status;
        await submission.save();

        // ✅ Add points to user if status is "Approved"
        if (status === "Approved") {
            const user = await User.findById(submission.user);
            if (user) {
                const pointsToAdd = 5;
                const expToAdd = 20;
                user.points += pointsToAdd;
                user.exp += expToAdd;
                user.rank = getRank(user.exp);
                await user.save();
            }
        }

        res.status(200).json({ message: "Status and image data updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update status" });
    }
};

// GET all e-waste submissions 
const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await EWaste.find().populate("user");
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching submissions" });
    }
};

// DELETE Ewaste image :admin
const deleteEWaste = async (req, res) => {
    try {
        const { id } = req.params;
        const submission = await EWaste.findById(id);

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        for (const file of submission.attachments) {
            const filePath = path.join(__dirname, "..", file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(200).json({ message: "E-waste submission deleted successfully" });
    } catch (err) {
        console.error("Error deleting e-waste submission:", err);
        res.status(500).json({ message: "Server error while deleting submission" });
    }
};

// POST a new reward 
const addReward = async (req, res) => {
    try {
        const { name, price } = req.body;
        const reward = await Reward.create({ name, price });

        return res.status(201).json({
            message: "Reward added successfully!",
            reward
        });
    } catch (error) {
        console.error("Error adding reward:", error);
        return res.status(500).json({ error: "Failed to add reward" });
    }
};

module.exports = {
    getEwastes,
    getUserData,
    countUsersByRole,
    deleteUser,
    updateSubmissionStatus,
    getAllSubmissions,
    deleteEWaste,
    addReward,
};
