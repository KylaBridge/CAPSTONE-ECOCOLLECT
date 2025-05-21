const User = require('../models/user');
const EWaste = require('../models/ewaste');
const Reward = require('../models/rewards');
const Redemption = require('../models/redemption');
const Badge = require('../models/badge');
const path = require("path");
const fs = require("fs");
const { getRank } = require('../helpers/rank');

//
// ------------------ E-WASTE SUBMISSIONS ------------------
//

// Get counts of approved ewaste items by category
const getEwastes = async (req, res) => {
  try {
    const telephoneCount = await EWaste.countDocuments({ category: "Telephone", status: "Approved" });
    const routerCount = await EWaste.countDocuments({ category: "Router", status: "Approved" });
    const mobileCount = await EWaste.countDocuments({ category: "Mobile Phone", status: "Approved" });
    const tabletCount = await EWaste.countDocuments({ category: "Tablet", status: "Approved" });
    const laptopCount = await EWaste.countDocuments({ category: "Laptop", status: "Approved" });
    const chargerCount = await EWaste.countDocuments({ category: "Charger", status: "Approved" });
    const batteryCount = await EWaste.countDocuments({ category: "Batteries", status: "Approved" });
    const cordCount = await EWaste.countDocuments({ category: "Cords", status: "Approved" });
    const powerbankCount = await EWaste.countDocuments({ category: "Powerbank", status: "Approved" });
    const usbCount = await EWaste.countDocuments({ category: "USB", status: "Approved" });

    res.status(200).json({
      telephoneCount,
      routerCount,
      mobileCount,
      tabletCount,
      laptopCount,
      chargerCount,
      batteryCount,
      cordCount,
      powerbankCount,
      usbCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed fetching ewastes" });
  }
};

// Get all e-waste submissions with user details populated
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await EWaste.find().populate("user");
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

// Update submission status and manage related user points and image files
const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const submission = await EWaste.findById(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Delete images if status changed from "Pending"
    if (status !== "Pending" && submission.attachments.length > 0) {
      submission.attachments.forEach(file => {
        const filePath = path.join(__dirname, "..", file.path);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      submission.attachments = [];
    }

    submission.status = status;
    await submission.save();

    if (status === "Approved") {
      const user = await User.findById(submission.user);
      if (user) {
        user.points += 5;
        user.exp += 20;
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

// Delete e-waste submission and its image files
const deleteEWaste = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await EWaste.findById(id);

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    for (const file of submission.attachments) {
      const filePath = path.join(__dirname, "..", file.path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await EWaste.findByIdAndDelete(id); // actually delete the submission itself

    res.status(200).json({ message: "E-waste submission deleted successfully" });
  } catch (err) {
    console.error("Error deleting e-waste submission:", err);
    res.status(500).json({ message: "Server error while deleting submission" });
  }
};

//
// ------------------ USER MANAGEMENT ------------------
//

// Get all users
const getUserData = async (req, res) => {
  try {
    const data = await User.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed fetching users" });
  }
};

// Count users grouped by role
const countUsersByRole = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: "user" });
    const adminCount = await User.countDocuments({ role: "admin" });

    res.status(200).json({ userCount, adminCount });
  } catch (error) {
    console.error("Error counting roles:", error);
    res.status(500).json({ message: "Failed to count roles" });
  }
};

// Delete a user by ID (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

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
    res.status(200).json({ message: "Reward deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete reward" });
  }
};

// Get redemption history for user
const getUserRedemptions = async (req, res) => {
    try {
        const { userId } = req.params;
        const redemptions = await Redemption.find({ userId })
            .sort({ redemptionDate: -1 })
            .populate('rewardId', 'name points');
        res.status(200).json(redemptions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch redemption history" });
    }
};

//
// ------------------ BADGE MANAGEMENT ------------------
//

// Get all badges
const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ createdAt: -1 });
    res.status(200).json(badges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch badges" });
  }
};

// Add new badge with image
const addBadge = async (req, res) => {
  try {
    const { name, description, milestoneCondition, pointsRequired } = req.body;
    const image = req.file ? {
      name: req.file.originalname,
      path: req.file.path
    } : null;

    const newBadge = new Badge({
      name,
      description,
      milestoneCondition,
      pointsRequired: Number(pointsRequired),
      image
    });

    await newBadge.save();
    res.status(201).json({ message: "Badge added successfully", badge: newBadge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add badge" });
  }
};

// Update badge with optional image update
const updateBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, milestoneCondition, pointsRequired } = req.body;
    
    const badge = await Badge.findById(id);
    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }

    // If there's a new image file, update it
    if (req.file) {
      // Delete old image if it exists
      if (badge.image && badge.image.path) {
        const oldImagePath = path.join(__dirname, "..", badge.image.path);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      badge.image = {
        name: req.file.originalname,
        path: req.file.path
      };
    }

    // Update other fields
    badge.name = name;
    badge.description = description;
    badge.milestoneCondition = milestoneCondition;
    badge.pointsRequired = Number(pointsRequired);

    await badge.save();
    res.status(200).json({ message: "Badge updated successfully", badge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update badge" });
  }
};

// Delete badge and its image
const deleteBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const badge = await Badge.findById(id);

    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }

    // Delete the image file if it exists
    if (badge.image && badge.image.path) {
      const imagePath = path.join(__dirname, "..", badge.image.path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Badge.findByIdAndDelete(id);
    res.status(200).json({ message: "Badge deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete badge" });
  }
};

// Get total badge count
const getBadgeCount = async (req, res) => {
  try {
    const count = await Badge.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get badge count" });
  }
};

module.exports = {
  // E-waste submissions
  getEwastes,
  getAllSubmissions,
  updateSubmissionStatus,
  deleteEWaste,

  // User management
  getUserData,
  countUsersByRole,
  deleteUser,

  // Rewards management
  getAllRewards,
  addReward,
  updateReward,
  deleteReward,

  // Redemption history
  getUserRedemptions,

  // Badge management
  getAllBadges,
  addBadge,
  updateBadge,
  deleteBadge,
  getBadgeCount
};
