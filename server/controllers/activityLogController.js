const ActivityLog = require('../models/activityLog');

// Get all activity logs (optionally filter by action or user)
const getAllActivityLogs = async (req, res) => {
    try {
        const { userId, action } = req.query;
        let filter = {};
        if (userId) filter.userId = userId;
        if (action) filter.action = action;

        const logs = await ActivityLog.find(filter).sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch activity logs" });
    }
};

// Get activity logs for a specific user
const getUserActivityLogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const logs = await ActivityLog.find({ userId }).sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch user activity logs" });
    }
};

// Add a new activity log
const addActivityLog = async (req, res) => {
    try {
        const { userId, userEmail, action, details } = req.body;
        const log = new ActivityLog({ userId, userEmail, action, details });
        await log.save();
        res.status(201).json({ message: "Activity log added", log });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add activity log" });
    }
};

module.exports = {
    getAllActivityLogs,
    getUserActivityLogs,
    addActivityLog,
};
