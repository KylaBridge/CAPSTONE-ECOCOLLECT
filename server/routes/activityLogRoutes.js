const express = require("express");
const router = express.Router();
const {
  sanitizeFilePaths,
  validateUrlParameters,
} = require("../middleware/securityMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getAllActivityLogs,
  getUserActivityLogs,
  addActivityLog,
} = require("../controllers/activityLogController");

// Apply security middleware
router.use(sanitizeFilePaths);
router.use(validateUrlParameters);

// Activity log routes
router.get("/", authMiddleware, getAllActivityLogs); // Get all activity logs
router.get("/user/:userId", authMiddleware, getUserActivityLogs); // Get user activity logs
router.post("/", authMiddleware, addActivityLog); // Add activity log

module.exports = router;
