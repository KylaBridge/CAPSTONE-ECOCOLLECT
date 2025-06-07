const Reward = require('../models/rewards');
const path = require("path");
const fs = require("fs");
const Redemption = require('../models/redemption');
const ActivityLog = require('../models/activityLog');

//
// ------------------ REWARDS MANAGEMENT ------------------
//

// Get all rewards
const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ createdAt: -1 });
    res.status(200).json(rewards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch rewards" });
  }
};

// Add new reward with image
const addReward = async (req, res) => {
  try {
    const { name, category, points, description } = req.body;
    const image = req.file ? {
      name: req.file.originalname,
      path: req.file.path
    } : null;

    const newReward = new Reward({
      name,
      category,
      points: Number(points),
      description,
      image
    });

    await newReward.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || 'Admin',
      userRole: req.user?.role,
      action: 'Reward Added',
      details: `Added reward ${name}`,
    });

    res.status(201).json({ message: "Reward added successfully", reward: newReward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add reward" });
  }
};

// Update reward with optional image update
const updateReward = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, points, description } = req.body;
    
    const reward = await Reward.findById(id);
    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    // If there's a new image file, update it
    if (req.file) {
      // Delete old image if it exists
      if (reward.image && reward.image.path) {
        const oldImagePath = path.join(__dirname, "..", reward.image.path);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      reward.image = {
        name: req.file.originalname,
        path: req.file.path
      };
    }

    // Update other fields
    reward.name = name;
    reward.category = category;
    reward.points = Number(points);
    reward.description = description;

    await reward.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || 'Admin',
      userRole: req.user?.role,
      action: 'Reward Updated',
      details: `Updated reward ${name}`,
    });

    res.status(200).json({ message: "Reward updated successfully", reward });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update reward" });
  }
};

// Delete reward and its image
const deleteReward = async (req, res) => {
  try {
    const { id } = req.params;
    const reward = await Reward.findById(id);

    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    // Delete the image file if it exists
    if (reward.image && reward.image.path) {
      const imagePath = path.join(__dirname, "..", reward.image.path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Reward.findByIdAndDelete(id);

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || 'Admin',
      userRole: req.user?.role,
      action: 'Reward Deleted',
      details: `Deleted reward ${reward.name}`,
    });

    res.status(200).json({ message: "Reward deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete reward" });
  }
};

// Get reward redemption statistics
const getRewardRedemptionStats = async (req, res) => {
  try {
    const { period } = req.query; // 'weekly' or 'monthly'
    
    // Get the date range based on period
    const now = new Date();
    const startDate = new Date();
    if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    // Aggregate redemptions by reward
    const redemptions = await Redemption.aggregate([
      {
        $match: {
          redemptionDate: { $gte: startDate, $lte: now }
        }
      },
      {
        $lookup: {
          from: 'rewards',
          localField: 'rewardId',
          foreignField: '_id',
          as: 'reward'
        }
      },
      {
        $unwind: '$reward'
      },
      {
        $group: {
          _id: '$reward.name',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.status(200).json(redemptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get reward redemption stats" });
  }
};

module.exports = {
  getAllRewards,
  addReward,
  updateReward,
  deleteReward,
  getRewardRedemptionStats,
};