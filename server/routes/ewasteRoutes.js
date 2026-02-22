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
  getEwastes,
  getAllSubmissions,
  updateSubmissionStatus,
  deleteEWaste,
} = require("../controllers/ewasteController");

const {
  submitEWaste,
  userSubmitCount,
  getUserSubmissions,
} = require("../controllers/userController");

// Ensure uploads folder exists
const uploadDirectory = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Apply security middleware
router.use(sanitizeFilePaths);
router.use(validateUrlParameters);

// Admin routes
router.get("/ewastes", authMiddleware, getEwastes); // Ewaste counts by category
router.get("/", authMiddleware, getAllSubmissions); // All ewaste submissions
router.put("/:id/status", authMiddleware, updateSubmissionStatus); // Update ewaste status
router.delete("/:id", authMiddleware, deleteEWaste); // Delete ewaste

// User routes
router.post("/", authMiddleware, upload.array("attachments", 5), submitEWaste); // Submit ewaste
router.get("/user/:userId/count", authMiddleware, userSubmitCount); // User submission count
router.get("/user/:userId", authMiddleware, getUserSubmissions); // User submissions

module.exports = router;
