const Reward = require("../models/rewards");
const {
  buildObjectKey,
  uploadToS3,
  deleteFromS3,
  getKeyFromUrl,
  signUrlForPath,
} = require("../helpers/s3");
const Redemption = require("../models/redemption");
const ActivityLog = require("../models/activityLog");

//
// ------------------ REWARDS MANAGEMENT ------------------
//

// Get all rewards
const getAllRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().sort({ createdAt: -1 }).lean();
    const signedRewards = await Promise.all(
      rewards.map(async (reward) => {
        if (!reward.image || !reward.image.path) return reward;
        const signedPath = await signUrlForPath(reward.image.path);
        return {
          ...reward,
          image: {
            ...reward.image,
            path: signedPath || reward.image.path,
          },
        };
      }),
    );
    res.status(200).json(signedRewards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch rewards" });
  }
};

// Add new reward with image
const addReward = async (req, res) => {
  try {
    const { name, category, points, description } = req.body;
    let image = null;

    if (req.file) {
      const key = buildObjectKey("rewards", req.file.originalname);
      const uploaded = await uploadToS3({
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
        key,
      });
      image = {
        name: req.file.originalname,
        path: uploaded.url,
      };
    }

    const newReward = new Reward({
      name,
      category,
      points: Number(points),
      description,
      image,
    });

    await newReward.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role,
      action: "Reward Added",
      details: `Added reward ${name}`,
    });

    const rewardData = newReward.toObject();
    if (rewardData.image?.path) {
      const signedPath = await signUrlForPath(rewardData.image.path);
      rewardData.image.path = signedPath || rewardData.image.path;
    }

    res
      .status(201)
      .json({ message: "Reward added successfully", reward: rewardData });
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
      const key = buildObjectKey("rewards", req.file.originalname);
      const uploaded = await uploadToS3({
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
        key,
      });

      if (reward.image && reward.image.path) {
        const oldKey = getKeyFromUrl(reward.image.path);
        if (oldKey) {
          await deleteFromS3(oldKey);
        }
      }

      reward.image = {
        name: req.file.originalname,
        path: uploaded.url,
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
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role,
      action: "Reward Updated",
      details: `Updated reward ${name}`,
    });

    const rewardData = reward.toObject();
    if (rewardData.image?.path) {
      const signedPath = await signUrlForPath(rewardData.image.path);
      rewardData.image.path = signedPath || rewardData.image.path;
    }

    res
      .status(200)
      .json({ message: "Reward updated successfully", reward: rewardData });
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
      const key = getKeyFromUrl(reward.image.path);
      if (key) {
        await deleteFromS3(key);
      }
    }

    await Reward.findByIdAndDelete(id);

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id || null,
      userEmail: req.user?.email || "Admin",
      userRole: req.user?.role,
      action: "Reward Deleted",
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
    const { period, year, month, week } = req.query; // 'weekly' or 'monthly' + date parameters

    let startDate, endDate;

    if (period === "weekly") {
      const targetYear = parseInt(year) || new Date().getFullYear();
      const targetMonth = parseInt(month) || new Date().getMonth() + 1;

      if (week && parseInt(week) > 0) {
        // Specific week requested - calculate week boundaries
        const weekNumber = parseInt(week);
        const firstDay = new Date(targetYear, targetMonth - 1, 1);

        // Find the first Monday of the month
        const dayOfWeek = firstDay.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const firstMonday = new Date(firstDay);
        firstMonday.setDate(firstDay.getDate() - daysToMonday);

        // Calculate the start of the specific week
        startDate = new Date(firstMonday);
        startDate.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);

        // End date is 6 days later (Sunday)
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);

        // Don't exceed the month boundary
        const lastDayOfMonth = new Date(targetYear, targetMonth, 0);
        if (endDate > lastDayOfMonth) {
          endDate = new Date(lastDayOfMonth);
          endDate.setHours(23, 59, 59, 999);
        }
      } else {
        // All weeks in the month
        startDate = new Date(targetYear, targetMonth - 1, 1);
        endDate = new Date(targetYear, targetMonth, 0);
        endDate.setHours(23, 59, 59, 999);
      }
    } else {
      // Monthly view
      const targetYear = parseInt(year) || new Date().getFullYear();

      if (month && parseInt(month) > 0) {
        // Specific month requested
        const targetMonth = parseInt(month);
        startDate = new Date(targetYear, targetMonth - 1, 1);
        endDate = new Date(targetYear, targetMonth, 0);
        endDate.setHours(23, 59, 59, 999);
      } else {
        // All months in the year
        startDate = new Date(targetYear, 0, 1); // January 1st
        endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999); // December 31st
      }
    }

    // Don't include future dates
    const now = new Date();
    if (startDate > now) {
      return res.status(200).json([]);
    }
    if (endDate > now) {
      endDate = new Date(now);
    }

    // Aggregate redemptions by reward
    const redemptions = await Redemption.aggregate([
      {
        $match: {
          redemptionDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: "rewards",
          localField: "rewardId",
          foreignField: "_id",
          as: "reward",
        },
      },
      {
        $unwind: "$reward",
      },
      {
        $group: {
          _id: "$reward.name",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
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
