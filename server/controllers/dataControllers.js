const User = require('../models/user');
const EWaste = require("../models/ewaste");
const path = require("path");
const fs = require("fs");

// GET all users
const getUserData = async (req, res) => {
    const data = await User.find({});
    res.status(200).json(data);
};

// DELETE user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
};

// Submit EWaste
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

// Get submissions by user
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

// Update submission status 
const updateSubmissionStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const submission = await EWaste.findById(id);

        if (!submission) return res.status(404).json({ message: "Submission not found" });

        // If status changes from "Pending", delete image files and remove from DB
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

        res.status(200).json({ message: "Status and image data updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update status" });
    }
};

// Get all e-waste submissions
const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await EWaste.find().populate("user"); // Populate user info
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching submissions" });
    }
};

// Delete Ewaste
const deleteEWaste = async (req, res) => {
    try {
        const { id } = req.params;
        const submission = await EWaste.findById(id);

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Delete image files from server
        for (const file of submission.attachments) {
            const filePath = path.join(__dirname, "..", file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Delete the document from DB
        await EWaste.findByIdAndDelete(id);

        res.status(200).json({ message: "E-waste submission deleted successfully" });
    } catch (err) {
        console.error("Error deleting e-waste submission:", err);
        res.status(500).json({ message: "Server error while deleting submission" });
    }
};

module.exports = {
    getUserData,
    deleteUser,
    submitEWaste,
    getUserSubmissions,
    updateSubmissionStatus,
    getAllSubmissions,
    deleteEWaste,
};
