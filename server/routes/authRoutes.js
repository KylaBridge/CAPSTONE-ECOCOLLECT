const express = require("express");
const router = express.Router();
const passport = require("passport");
const { rateLimitAuth } = require("../middleware/securityMiddleware");
const {
  registerEmailName,
  checkUsernameAvailability,
  registerPassword,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  sessionInfo,
  extendSession,
  googleAuthStart,
  googleAuthCallback,
  googleProfile,
  verifyPassword,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/authControllers");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register/email", rateLimitAuth, registerEmailName);
router.post("/check-username", rateLimitAuth, checkUsernameAvailability);
router.post("/register/password", rateLimitAuth, registerPassword);
router.post("/register", rateLimitAuth, registerUser);
router.post("/login", rateLimitAuth, loginUser);
router.get("/profile", getProfile);
router.post("/logout", logoutUser);
router.post("/verify-password", verifyPassword);

// Password reset routes
router.post("/forgot-password", rateLimitAuth, forgotPassword);
router.post("/verify-reset-code", rateLimitAuth, verifyResetCode);
router.post("/reset-password", rateLimitAuth, resetPassword);

router.get("/session", sessionInfo); // public read (returns null if no token)
router.post("/session/extend", authMiddleware, extendSession); // must be authenticated

// Google OAuth start - with rate limiting and parameter validation
router.get("/google", rateLimitAuth, googleAuthStart);

// Middleware to validate OAuth callback parameters
const validateOAuthCallback = (req, res, next) => {
  const allowedCallbackParams = [
    "code",
    "state",
    "scope",
    "authuser",
    "prompt",
    "hd",
    "error",
    "error_description",
  ];
  const queryParams = Object.keys(req.query);

  for (const param of queryParams) {
    if (!allowedCallbackParams.includes(param)) {
      console.warn(`Unauthorized OAuth callback parameter detected: ${param}`);
      return res.status(400).json({
        error: "Unauthorized callback parameter",
        code: "INVALID_OAUTH_PARAMETER",
        parameter: param,
      });
    }
  }
  next();
};

// Google OAuth callback (first validate parameters, then passport authenticate, then controller)
router.get(
  "/google/callback",
  validateOAuthCallback,
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/",
  }),
  googleAuthCallback
);

// Optional profile route after oauth (requires passport sessionless user injection if used)
router.get("/google/profile", googleProfile);

module.exports = router;
