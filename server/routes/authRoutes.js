const express = require("express");
const router = express.Router();
const passport = require('passport');
const {
  registerAdmin,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  googleAuthStart,
  googleAuthCallback,
  googleProfile,
} = require("../controllers/authControllers");

router.post("/register-admin", registerAdmin);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/logout", logoutUser);

// Google OAuth start
router.get('/google', googleAuthStart);

// Google OAuth callback (first passport authenticate, then controller)
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: process.env.GOOGLE_FAIL_REDIRECT || '/' }), googleAuthCallback);

// Optional profile route after oauth (requires passport sessionless user injection if used)
router.get('/google/profile', googleProfile);

module.exports = router;
