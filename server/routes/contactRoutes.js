const express = require("express");
const router = express.Router();
const {
  sanitizeFilePaths,
  validateUrlParameters,
} = require("../middleware/securityMiddleware");

const { sendContactMessage } = require("../controllers/sendEmailController");

// Apply security middleware
router.use(sanitizeFilePaths);
router.use(validateUrlParameters);

// Public contact route (no auth required)
router.post("/", sendContactMessage);

module.exports = router;
