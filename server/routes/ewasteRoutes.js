const express = require("express");
const router = express.Router();
const multer = require("multer");
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

const storage = multer.memoryStorage();
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
