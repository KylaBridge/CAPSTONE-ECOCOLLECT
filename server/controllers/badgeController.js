const Badge = require("../models/badge");
const path = require("path");
const fs = require("fs");
const ActivityLog = require("../models/activityLog");
const User = require("../models/user");
const { updateUserRank } = require("./userController");

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
    const image = req.file
      ? {
          name: req.file.originalname,
          path: req.file.path,
        }
      : null;

    const newBadge = new Badge({
      name,
      description,
      milestoneCondition,
      pointsRequired: Number(pointsRequired),
      image,
    });

    await newBadge.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role,
      action: "Badge Added",
      details: `Added badge ${name}`,
    });

    res
      .status(201)
      .json({ message: "Badge added successfully", badge: newBadge });
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
        path: req.file.path,
      };
    }

    // Update other fields
    badge.name = name;
    badge.description = description;
    badge.milestoneCondition = milestoneCondition;
    badge.pointsRequired = Number(pointsRequired);

    await badge.save();

    // Propagate updates to users' badgeHistory entries (name, pointsRequired)
    await User.updateMany(
      { "badgeHistory.badgeId": badge._id },
      {
        $set: {
          "badgeHistory.$[elem].badgeName": badge.name,
          "badgeHistory.$[elem].pointsRequired": badge.pointsRequired,
        },
      },
      { arrayFilters: [{ "elem.badgeId": badge._id }] },
    );

    // Remove badgeHistory entries for users who no longer meet the updated pointsRequired
    const usersToRemove = await User.find(
      { "badgeHistory.badgeId": badge._id, exp: { $lt: badge.pointsRequired } },
      { _id: 1 },
    );

    if (usersToRemove.length) {
      const ids = usersToRemove.map((u) => u._id);

      // Pull the badgeHistory entry where badgeId matches
      await User.updateMany(
        { _id: { $in: ids } },
        { $pull: { badgeHistory: { badgeId: badge._id } } },
      );

      // Recalculate ranks for affected users
      for (const uid of ids) {
        await updateUserRank(uid);
      }
    }

    // Add badgeHistory entries for users who meet the updated pointsRequired
    const usersToAdd = await User.find(
      {
        exp: { $gte: badge.pointsRequired },
        "badgeHistory.badgeId": { $ne: badge._id },
      },
      { _id: 1 },
    );

    if (usersToAdd.length) {
      const addIds = usersToAdd.map((u) => u._id);
      const now = new Date();

      await User.updateMany(
        { _id: { $in: addIds } },
        {
          $push: {
            badgeHistory: {
              badgeName: badge.name,
              badgeId: badge._id,
              earnedAt: now,
              pointsRequired: badge.pointsRequired,
            },
          },
        },
      );

      for (const uid of addIds) {
        await updateUserRank(uid);
      }
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role,
      action: "Badge Updated",
      details: `Updated badge ${name}`,
    });

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

    // Remove this badge from users' badgeHistory entries
    const usersWithBadge = await User.find(
      { "badgeHistory.badgeId": badge._id },
      { _id: 1 },
    );

    if (usersWithBadge.length) {
      const userIds = usersWithBadge.map((u) => u._id);

      await User.updateMany(
        { _id: { $in: userIds } },
        { $pull: { badgeHistory: { badgeId: badge._id } } },
      );

      for (const uid of userIds) {
        await updateUserRank(uid);
      }
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role,
      action: "Badge Deleted",
      details: `Deleted badge ${badge.name}`,
    });

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

// Get badge by ID
const getBadgeById = async (req, res) => {
  try {
    const { id } = req.params;
    const badge = await Badge.findById(id);

    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }

    res.status(200).json(badge);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch badge" });
  }
};

module.exports = {
  getAllBadges,
  addBadge,
  updateBadge,
  deleteBadge,
  getBadgeCount,
  getBadgeById,
};
