const express = require("express");
const router = express.Router();
const passport = require("passport");
const { rateLimitAuth } = require("../middleware/securityMiddleware");
const {
  registerEmailName,
  registerPassword,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  googleAuthStart,
  googleAuthCallback,
  googleProfile,
  verifyPassword,
} = require("../controllers/authControllers");

router.post("/register/email", rateLimitAuth, registerEmailName);
router.post("/register/password", rateLimitAuth, registerPassword);
router.post("/register", rateLimitAuth, registerUser);
router.post("/login", rateLimitAuth, loginUser);
router.get("/profile", getProfile);
router.post("/logout", logoutUser);
router.post("/verify-password", verifyPassword);

// Google OAuth start - with rate limiting and parameter validation
router.get("/google", rateLimitAuth, googleAuthStart);

// Middleware to validate OAuth callback parameters
const validateOAuthCallback = (req, res, next) => {
  const allowedCallbackParams = [
    'code', 'state', 'scope', 'authuser', 'prompt', 'hd', 'error', 'error_description'
  ];
  const queryParams = Object.keys(req.query);
  
  for (const param of queryParams) {
    if (!allowedCallbackParams.includes(param)) {
      console.warn(`Unauthorized OAuth callback parameter detected: ${param}`);
      return res.status(400).json({ 
        error: "Unauthorized callback parameter",
        code: "INVALID_OAUTH_PARAMETER",
        parameter: param
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
