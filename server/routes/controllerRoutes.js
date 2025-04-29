const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { 
    getUserData, 
    deleteUser, 
    updateSubmissionStatus, 
    getAllSubmissions, 
    deleteEWaste 
} = require('../controllers/adminController');
const { 
    submitEWaste, 
    getUserSubmissions 
} = require('../controllers/userController');

// Ensure uploads folder exists
const uploadDirectory = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
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

const upload = multer({ storage: storage });

router.get("/usermanagement", getUserData);
router.delete("/usermanagement/:id", deleteUser);
router.post("/ewaste", upload.array("attachments", 5), submitEWaste);
router.get("/ewaste/user/:userId", getUserSubmissions);
router.put("/ewaste/:id/status", updateSubmissionStatus);
router.get("/ewaste", getAllSubmissions); 
router.delete("/ewaste/:id", deleteEWaste);

module.exports = router;