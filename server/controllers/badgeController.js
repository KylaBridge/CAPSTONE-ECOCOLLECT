const Badge = require('../models/badge');
const path = require("path");
const fs = require("fs");

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
  getAllBadges,
  addBadge,
  updateBadge,
  deleteBadge,
  getBadgeCount,
};