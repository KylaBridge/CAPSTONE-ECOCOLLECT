const express = require("express");
const router = express.Router();
const {
  sanitizeFilePaths,
  validateUrlParameters,
} = require("../middleware/securityMiddleware");
const {
  authMiddleware,
  superAdminMiddleware,
} = require("../middleware/authMiddleware");

const {
  getUserData,
  countUsersByRole,
  deleteUser,
  getUserParticipationData,
  addUser,
  changeUserRole,
} = require("../controllers/userManageController");

// Apply security middleware
router.use(sanitizeFilePaths);
router.use(validateUrlParameters);

// User management routes
router.get("/", authMiddleware, getUserData); // Get all users
router.get("/count", authMiddleware, countUsersByRole); // User/admin count
router.post("/add", authMiddleware, addUser); // Add user/admin (role-based)
router.delete("/:id", authMiddleware, deleteUser); // Delete user
router.patch("/role/:id", authMiddleware, superAdminMiddleware, changeUserRole); // Change user role

// Analytics routes
router.get(
  "/analytics/participation",
  authMiddleware,
  getUserParticipationData,
); // User participation data

module.exports = router;
