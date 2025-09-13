const User = require("../models/user");
const EWaste = require("../models/ewaste");
const Redemption = require("../models/redemption");
const ActivityLog = require("../models/activityLog");

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
    const user = await User.findByIdAndDelete(id);

    // Use admin's ID if available, otherwise fallback to deleted user's ID
    const logUserId = req.user?._id;
    const logUserEmail = req.user?.email || "Unknown";

    // Only log if we have a userId
    if (logUserId) {
      await ActivityLog.create({
        userId: logUserId,
        userEmail: logUserEmail,
        userRole: req.user?.role,
        action: "User Deleted",
        details: `Deleted user ${user?.email || id}`,
      });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Get user participation data
const getUserParticipationData = async (req, res) => {
  try {
    const { year, viewType } = req.query;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    let groupBy;
    let dateFormat;

    switch (viewType) {
      case "Daily":
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        dateFormat = "%Y-%m-%d";
        break;
      case "Weekly":
        groupBy = { $dateToString: { format: "%Y-%U", date: "$createdAt" } };
        dateFormat = "%Y-%U";
        break;
      case "Monthly":
        groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        dateFormat = "%Y-%m";
        break;
      default:
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        dateFormat = "%Y-%m-%d";
    }

    // Get submissions count
    const submissions = await EWaste.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get redemptions count
    const redemptions = await Redemption.aggregate([
      {
        $match: {
          redemptionDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get signups count
    const signups = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      submissions,
      redemptions,
      signups,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get user participation data" });
  }
};

module.exports = {
  getUserData,
  countUsersByRole,
  deleteUser,
  getUserParticipationData,
};
