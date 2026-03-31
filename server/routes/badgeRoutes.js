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
  getAllBadges,
  addBadge,
  updateBadge,
  deleteBadge,
  getBadgeCount,
  getBadgeById,
} = require("../controllers/badgeController");

// Ensure badges images folder exists
const badgesDirectory = path.join(__dirname, "..", "uploads", "badges");
if (!fs.existsSync(badgesDirectory)) {
  fs.mkdirSync(badgesDirectory, { recursive: true });
}

const badgesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/badges/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "badge-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const badgesUpload = multer({ storage: badgesStorage });

// Apply security middleware (except for public routes)
router.use((req, res, next) => {
  // Skip security middleware for public routes
  if (req.path.startsWith("/public/")) {
    return next();
  }
  sanitizeFilePaths(req, res, () => {
    validateUrlParameters(req, res, next);
  });
});

// Public badge sharing route (no auth required) - MUST be before /:id to match correctly
router.get("/public/:id", async (req, res) => {
  try {
    const Badge = require("../models/badge");
    const User = require("../models/user");

    const { id } = req.params;
    const { userId, userName, userEmail } = req.query;

    // Additional security: Validate query parameters for badge sharing
    if (
      userId &&
      (typeof userId !== "string" || !/^[a-fA-F0-9]{24}$/.test(userId))
    ) {
      return res.status(400).json({ error: "Invalid userId format" });
    }
    if (userName && (typeof userName !== "string" || userName.length > 100)) {
      return res.status(400).json({ error: "Invalid userName format" });
    }
    if (
      userEmail &&
      (typeof userEmail !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail))
    ) {
      return res.status(400).json({ error: "Invalid userEmail format" });
    }

    const badge = await Badge.findById(id);

    if (!badge) {
      return res.status(404).json({ message: "Badge not found" });
    }

    // If user information is provided in query params, include it
    let badgeWithUser = { ...badge.toObject() };

    if (userId || userName || userEmail) {
      badgeWithUser.earnedBy = {
        name: userName || "EcoCollect Champion",
        email: userEmail || "champion@ecocollect.com",
        _id: userId,
      };

      // Look up the actual earned date from user's badge history.
      // Prefer `userId`, but if it's not provided try to find the user by
      // email or name so public share links that only include email/name
      // can still show the correct earned date.
      let actualEarnedDate = null;

      const findBadgeEarnedDateFromUser = (user) => {
        if (!user || !user.badgeHistory) return null;
        const badgeEntry = user.badgeHistory.find(
          (entry) => entry.badgeId.toString() === id,
        );
        return badgeEntry && badgeEntry.earnedAt ? badgeEntry.earnedAt : null;
      };

      if (userId) {
        try {
          const user = await User.findById(userId);
          actualEarnedDate = findBadgeEarnedDateFromUser(user);
        } catch (userError) {
          console.warn("Could not fetch user badge history by id:", userError);
        }
      }

      // If we didn't find it by id, try locating the user by email or name
      if (!actualEarnedDate && userEmail) {
        try {
          const user = await User.findOne({ email: userEmail });
          actualEarnedDate = findBadgeEarnedDateFromUser(user);
        } catch (userError) {
          console.warn("Could not fetch user badge history by email:", userError);
        }
      }

      if (!actualEarnedDate && userName) {
        try {
          const user = await User.findOne({ name: userName });
          actualEarnedDate = findBadgeEarnedDateFromUser(user);
        } catch (userError) {
          console.warn("Could not fetch user badge history by name:", userError);
        }
      }

      // Use actual earned date if found, otherwise fallback to current date
      badgeWithUser.dateEarned = actualEarnedDate
        ? actualEarnedDate.toISOString()
        : new Date().toISOString();
    }

    res.status(200).json(badgeWithUser);
  } catch (error) {
    console.error("Error fetching public badge:", error);
    res.status(500).json({ error: "Failed to fetch badge" });
  }
});

// Badge management routes (after public route to avoid conflicts)
router.get("/", authMiddleware, getAllBadges); // Get all badges
router.get("/count", authMiddleware, getBadgeCount); // Get badge count
router.get("/:id", authMiddleware, getBadgeById); // Get badge by ID
router.post("/", authMiddleware, badgesUpload.single("image"), addBadge); // Add badge
router.put("/:id", authMiddleware, badgesUpload.single("image"), updateBadge); // Update badge
router.delete("/:id", authMiddleware, deleteBadge); // Delete badge

module.exports = router;
