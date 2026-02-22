const express = require("express");
const router = express.Router();
const {
  sanitizeFilePaths,
  validateUrlParameters,
} = require("../middleware/securityMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getAllUserLeaderboards,
  getUserBadgeHistory,
} = require("../controllers/userController");

// Apply security middleware
router.use(sanitizeFilePaths);
router.use(validateUrlParameters);

// User routes
router.get("/leaderboards", authMiddleware, getAllUserLeaderboards); // Get leaderboards
router.get("/:userId/badge-history", authMiddleware, getUserBadgeHistory); // Get user badge history

module.exports = router;
