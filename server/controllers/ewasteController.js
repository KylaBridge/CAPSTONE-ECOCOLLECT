const User = require('../models/user');
const EWaste = require('../models/ewaste');
const path = require("path");
const fs = require("fs");
const { updateUserRank } = require('./userController');

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
        await user.save();
        await updateUserRank(user._id);
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

module.exports = {
  getEwastes,
  getAllSubmissions,
  updateSubmissionStatus,
  deleteEWaste,
};