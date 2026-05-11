const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  sanitizeFilePaths,
  validateUrlParameters,
} = require("../middleware/securityMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getAllRewards,
  addReward,
  updateReward,
  deleteReward,
  getRewardRedemptionStats,
} = require("../controllers/rewardsController");

const rewardsStorage = multer.memoryStorage();
const rewardsUpload = multer({ storage: rewardsStorage });

// Apply security middleware
router.use(sanitizeFilePaths);
router.use(validateUrlParameters);

// Rewards routes
router.get("/", authMiddleware, getAllRewards); // Get all rewards
router.post("/", authMiddleware, rewardsUpload.single("image"), addReward); // Add reward
router.put("/:id", authMiddleware, rewardsUpload.single("image"), updateReward); // Update reward
router.delete("/:id", authMiddleware, deleteReward); // Delete reward
router.get("/redemption-stats", authMiddleware, getRewardRedemptionStats); // Redemption stats

module.exports = router;
