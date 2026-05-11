const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  sanitizeFilePaths,
  validateUrlParameters,
} = require("../middleware/securityMiddleware");
const { authMiddleware } = require("../middleware/authMiddleware");

const {
  getAllBins,
  addBin,
  updateBin,
  deleteBin,
  getBinCount,
  getBinById,
} = require("../controllers/binController");

const binsStorage = multer.memoryStorage();
const binsUpload = multer({ storage: binsStorage });

// Apply security middleware
router.use(sanitizeFilePaths);
router.use(validateUrlParameters);

// Bin management routes
router.get("/", authMiddleware, getAllBins); // Get all bins
router.get("/count", authMiddleware, getBinCount); // Get bin count
router.get("/:id", authMiddleware, getBinById); // Get bin by ID
router.post("/", authMiddleware, binsUpload.single("image"), addBin); // Add bin
router.put("/:id", authMiddleware, binsUpload.single("image"), updateBin); // Update bin
router.delete("/:id", authMiddleware, deleteBin); // Delete bin

module.exports = router;
