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
    submitEWaste, 
    userSubmitCount,
    getUserSubmissions,
    redeemReward,
} = require('../controllers/userController');

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

// Admin Routes
router.get("/user/ewastes", getEwastes);
router.get("/usermanagement", getUserData);
router.get("/user/role-count", countUsersByRole);
router.delete("/usermanagement/:id", deleteUser);
router.put("/ewaste/:id/status", updateSubmissionStatus);
router.get("/ewaste", getAllSubmissions); 
router.delete("/ewaste/:id", deleteEWaste);
router.get("/rewards", getAllRewards);
router.post("/rewards", rewardsUpload.single("image"), addReward);
router.put("/rewards/:id", rewardsUpload.single("image"), updateReward);
router.delete("/rewards/:id", deleteReward);
router.get("/redeem/user/:userId", getUserRedemptions);
router.get("/redeem/all", getAllRedemptions);
router.get("/rewards/redemption-count", getRedemptionCount);
router.get("/rewards/redemption-stats", getRewardRedemptionStats);
router.get("/analytics/participation", getUserParticipationData);

// Badge Management Routes
router.get("/badges", getAllBadges);
router.get("/badges/count", getBadgeCount);
router.get("/badges/:id", getBadgeById);
router.post("/badges", badgesUpload.single("image"), addBadge);
router.put("/badges/:id", badgesUpload.single("image"), updateBadge);
router.delete("/badges/:id", deleteBadge);

// --- Bin Management Routes ---
router.get("/bins", getAllBins);
router.get("/bins/count", getBinCount);
router.get("/bins/:id", getBinById);
router.post("/bins", binsUpload.single("image"), addBin);
router.put("/bins/:id", binsUpload.single("image"), updateBin);
router.delete("/bins/:id", deleteBin);

// User Routes
router.post("/ewaste", upload.array("attachments", 5), submitEWaste);
router.get("/ewaste/user/:userId/count", userSubmitCount);
router.get("/ewaste/user/:userId", getUserSubmissions);
router.post("/redeem", redeemReward);

// User Management Routes
router.get("/users", getUserData);
router.get("/users/count", countUsersByRole);
router.delete("/users/:id", deleteUser);

module.exports = router;