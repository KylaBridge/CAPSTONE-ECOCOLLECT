const express = require("express");
const router = express.Router();
const {
  sanitizeFilePaths,
  validateUrlParameters,
} = require("../middleware/securityMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getUserRedemptions,
  getRedemptionCount,
  getAllRedemptions,
  getRedemptionForValidation,
  confirmRedemption,
} = require("../controllers/redemptionController");

const { redeemReward } = require("../controllers/userController");

// Apply security middleware (except for public validation routes)
router.use((req, res, next) => {
  // Skip security middleware for public validation routes
  if (req.path.startsWith("/validate/")) {
    return next();
  }
  sanitizeFilePaths(req, res, () => {
    validateUrlParameters(req, res, next);
  });
});

// User redemption routes
router.post("/", authMiddleware, redeemReward); // Redeem reward
router.get("/user/:userId", authMiddleware, getUserRedemptions); // Get user redemptions

// Admin routes
router.get("/all", authMiddleware, getAllRedemptions); // Get all redemptions
router.get("/count", authMiddleware, getRedemptionCount); // Get redemption count

// Public validation routes (no auth required)
router.get("/validate/:id", getRedemptionForValidation); // Get redemption for validation
router.post("/confirm/:id", confirmRedemption); // Confirm redemption

module.exports = router;
