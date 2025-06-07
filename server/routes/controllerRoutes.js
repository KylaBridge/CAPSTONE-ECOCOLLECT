const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Import controllers
const {
    getEwastes,
    getAllSubmissions,
    updateSubmissionStatus,
    deleteEWaste
} = require('../controllers/ewasteController');

const {
    getUserData,
    countUsersByRole,
    deleteUser,
    getUserParticipationData
} = require('../controllers/userManageController');

const {
    getAllRewards,
    addReward,
    updateReward,
    deleteReward,
    getRewardRedemptionStats
} = require('../controllers/rewardsController');

const {
    getUserRedemptions,
    getRedemptionCount,
    getAllRedemptions
} = require('../controllers/redemptionController');

const {
    getAllBadges,
    addBadge,
    updateBadge,
    deleteBadge,
    getBadgeCount,
    getBadgeById
} = require('../controllers/badgeController');

const {
    getAllBins,
    addBin,
    updateBin,
    deleteBin,
    getBinCount,
    getBinById
} = require ('../controllers/binController');

const {
    getAllActivityLogs,
    getUserActivityLogs,
    addActivityLog
} = require('../controllers/activityLogController');

const { 
    submitEWaste, 
    userSubmitCount,
    getUserSubmissions,
    redeemReward,
} = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware'); 

// Ensure uploads folder exists
const uploadDirectory = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Ensure rewards images folder exists
const rewardsDirectory = path.join(__dirname, "..", "uploads", "rewards");
if (!fs.existsSync(rewardsDirectory)) {
    fs.mkdirSync(rewardsDirectory, { recursive: true });
}

// Ensure badges images folder exists
const badgesDirectory = path.join(__dirname, "..", "uploads", "badges");
if (!fs.existsSync(badgesDirectory)) {
    fs.mkdirSync(badgesDirectory, { recursive: true });
}

// Ensure bins images folder exists
const binsDirectory = path.join(__dirname, "..", "uploads", "bins");
if (!fs.existsSync(binsDirectory)) {
    fs.mkdirSync(binsDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // this folder should exist or be created
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const rewardsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/rewards/"); // Store reward images in a separate folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const badgesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/badges/"); // Store badge images in a separate folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'badge-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const binsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/bins/"); // Store bin images in a separate folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'bin-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
const rewardsUpload = multer({ storage: rewardsStorage });
const badgesUpload = multer({ storage: badgesStorage });
const binsUpload = multer({ storage: binsStorage });

// ==================== ADMIN ROUTES ====================
router.get("/user/ewastes", authMiddleware, getEwastes); // Ewaste counts by category
router.get("/usermanagement", authMiddleware, getUserData); // All users
router.get("/user/role-count", authMiddleware, countUsersByRole); // User/admin count
router.delete("/usermanagement/:id", authMiddleware, deleteUser); // Delete user
router.put("/ewaste/:id/status", authMiddleware, updateSubmissionStatus); // Update ewaste status
router.get("/ewaste", authMiddleware, getAllSubmissions); // All ewaste submissions
router.delete("/ewaste/:id", authMiddleware, deleteEWaste); // Delete ewaste

// --- Rewards Management ---
router.get("/rewards", authMiddleware, getAllRewards);
router.post("/rewards", authMiddleware, rewardsUpload.single("image"), addReward);
router.put("/rewards/:id", authMiddleware, rewardsUpload.single("image"), updateReward);
router.delete("/rewards/:id", authMiddleware, deleteReward);
router.get("/rewards/redemption-count", authMiddleware, getRedemptionCount);
router.get("/rewards/redemption-stats", authMiddleware, getRewardRedemptionStats);

// --- Redemption Management ---
router.get("/redeem/user/:userId", authMiddleware, getUserRedemptions);
router.get("/redeem/all", authMiddleware, getAllRedemptions);

// --- Analytics ---
router.get("/analytics/participation", authMiddleware, getUserParticipationData);

// ==================== BADGE MANAGEMENT ROUTES ====================
router.get("/badges", authMiddleware, getAllBadges);
router.get("/badges/count", authMiddleware, getBadgeCount);
router.get("/badges/:id", authMiddleware, getBadgeById);
router.post("/badges", authMiddleware, badgesUpload.single("image"), addBadge);
router.put("/badges/:id", authMiddleware, badgesUpload.single("image"), updateBadge);
router.delete("/badges/:id", authMiddleware, deleteBadge);

// ==================== BIN MANAGEMENT ROUTES ====================
router.get("/bins", authMiddleware, getAllBins);
router.get("/bins/count", authMiddleware, getBinCount);
router.get("/bins/:id", authMiddleware, getBinById);
router.post("/bins", authMiddleware, binsUpload.single("image"), addBin);
router.put("/bins/:id", authMiddleware, binsUpload.single("image"), updateBin);
router.delete("/bins/:id", authMiddleware, deleteBin);

// ==================== ACTIVITY LOG ROUTES ====================
router.get("/activity-logs", authMiddleware, getAllActivityLogs);
router.get("/activity-logs/user/:userId", authMiddleware, getUserActivityLogs);
router.post("/activity-logs", authMiddleware, addActivityLog);

// ==================== USER ROUTES ====================
router.post("/ewaste", authMiddleware, upload.array("attachments", 5), submitEWaste);
router.get("/ewaste/user/:userId/count", authMiddleware, userSubmitCount);
router.get("/ewaste/user/:userId", authMiddleware, getUserSubmissions);
router.post("/redeem", authMiddleware, redeemReward);

// ==================== USER MANAGEMENT ROUTES ====================
router.get("/users", authMiddleware, getUserData);
router.get("/users/count", authMiddleware, countUsersByRole);
router.delete("/users/:id", authMiddleware, deleteUser);

module.exports = router;