const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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

// Ensure rewards images folder exists
const rewardsDirectory = path.join(__dirname, "..", "uploads", "rewards");
if (!fs.existsSync(rewardsDirectory)) {
  fs.mkdirSync(rewardsDirectory, { recursive: true });
}

const rewardsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/rewards/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

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
