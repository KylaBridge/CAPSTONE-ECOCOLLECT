const EWaste = require('../models/ewaste');

// Submit EWaste :user
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

// Get submissions by user :user
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

module.exports = {
    submitEWaste,
    getUserSubmissions,
};
