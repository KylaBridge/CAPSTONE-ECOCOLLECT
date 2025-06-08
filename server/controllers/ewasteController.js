const User = require('../models/user');
const EWaste = require('../models/ewaste');
const path = require("path");
const fs = require("fs");
const { updateUserRank } = require('./userController');
const ActivityLog = require('../models/activityLog'); 

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

// Add points to user based on e-waste category
const addPointsByCategory = async (userId, category) => {
  // Define points per category
  const categoryPoints = {
    "Laptop": 20,
    "Tablet": 15,
    "Mobile Phone": 10,
    "Telephone": 8,
    "Router": 8,
    "Charger": 5,
    "Batteries": 5,
    "Cords": 5,
    "Powerbank": 10,
    "USB": 5,
  };
  const points = categoryPoints[category] || 5; // Default to 5 if not found

  const user = await User.findById(userId);
  if (user) {
    user.points += points;
    user.exp += points * 4; // exp is 4x points, adjust as needed
    await user.save();
    await updateUserRank(user._id);
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

    // Log activity
    const user = await User.findById(submission.user);
    await ActivityLog.create({
      userId: user?._id,
      userEmail: user?.email || 'Unknown',
      userRole: user?.role,
      action: status === "Approved" ? "EWaste Approved" : status === "Rejected" ? "EWaste Rejected" : "EWaste Updated",
      details: `Submission ${submission.category} marked as ${status}`,
    });

    if (status === "Approved") {
      // Add points based on category
      await addPointsByCategory(submission.user, submission.category);
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

    await EWaste.findByIdAndDelete(id);

    // Log activity
    await ActivityLog.create({
      userId: submission.user,
      userEmail: 'Unknown', // Optionally fetch user for email
      userRole: req.user?.role,
      action: 'EWaste Deleted',
      details: `Deleted submission of ${submission.category}`,
    });

    res.status(200).json({ message: "E-waste submission deleted successfully" });
  } catch (err) {
    console.error("Error deleting e-waste submission:", err);
    res.status(500).json({ message: "Server error while deleting submission" });
  }
};

module.exports = {
  getEwastes,
  getAllSubmissions,
  updateSubmissionStatus,
  deleteEWaste,
};