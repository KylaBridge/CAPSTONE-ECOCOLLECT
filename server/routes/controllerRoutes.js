const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { 
    getEwastes,
    getAllSubmissions,
    updateSubmissionStatus,
    deleteEWaste,
    getUserData,
    countUsersByRole,
    deleteUser,
    getAllRewards,
    addReward,
    updateReward,
    deleteReward,
    getUserRedemptions
} = require('../controllers/adminController');
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

const upload = multer({ storage: storage });
const rewardsUpload = multer({ storage: rewardsStorage });

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