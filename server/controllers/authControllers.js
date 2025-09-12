const User = require("../models/user");
const { comparePassword, hashPassword } = require("../helpers/auth");
const { signToken, verifyToken } = require("../helpers/jwt");
const passport = require('passport');

// Register admin
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email must contain '@'
    if (!email || !/@/.test(email)) {
      return res.json({
        error: "Email must contain '@' character",
      });
    }

    // Password: at least 8 chars, at least one number, at least one special char
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.json({
        error:
          "Password must be at least 8 characters, include at least one number and one special character",
      });
    }

    // Check if email exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is already taken",
      });
    }

    // Creates the admin user in the database
    const hashedPassword = await hashPassword(password);
    const admin = await User.create({
      email,
      password: hashedPassword,
      role: "admin", // Set role to admin
    });
    return res.json(admin);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email must contain '@'
    if (!email || !/@/.test(email)) {
      return res.json({
        error: "Email must contain '@' character",
      });
    }

    // Password: at least 8 chars, at least one number, at least one special char
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      return res.json({
        error:
          "Password must be at least 8 characters, include at least one number and one special character",
      });
    }

    // Check if email exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email is already taken",
      });
    }

    // Creates the user in the database
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password, isAdminLogin } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "No user found" });
    }

    // If this is an admin login, only allow admins
    if (isAdminLogin && user.role !== "admin") {
      return res.json({ error: "You are not authorized to access this page" });
    }

    // Check if passwords match
    const match = await comparePassword(password, user.password);
    if (match) {
      // Only set token if not admin login or user is admin
      if (!isAdminLogin || user.role === "admin") {
        try {
          const token = await signToken({ email: user.email, id: user._id });
          res
            .cookie("token", token, {
              httpOnly: true,
              sameSite: "none",
              secure: true,
              path: "/",
              maxAge: 1000 * 60 * 30, // 30 minutes
            })
            .json({
              token,
              message: user.role === "admin" ? "User is an admin" : "User logged in",
              _id: user._id,
              role: user.role,
              name: user.name,
              email: user.email,
              exp: user.exp,
              points: user.points,
              rank: user.rank,
            });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: "Token generation failed" });
        }
      }
    } else {
      res.json({ error: "Email or password is invalid" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  // Support Authorization header (Bearer) and cookie
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.json(null);

  try {
    const decoded = await verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.status(200).json(user);
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};

// Initiate Google OAuth (delegates to passport)
const googleAuthStart = passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account'
});

// Google OAuth callback handler (after passport authenticates)
const googleAuthCallback = (req, res) => {
  const user = req.user;
  if (!user) return res.redirect(process.env.GOOGLE_FAIL_REDIRECT || '/');
  signToken({ email: user.email, id: user._id })
    .then(token => {
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        path: '/',
        maxAge: 1000 * 60 * 30,
      });
      const base = process.env.GOOGLE_SUCCESS_REDIRECT || process.env.FRONTEND_URL || '/';
      const redirectUrl = `${base.replace(/\/$/, '')}/?auth=google`;
      res.redirect(redirectUrl);
    })
    .catch(err => {
      console.error('JWT sign error', err);
      return res.redirect(process.env.GOOGLE_FAIL_REDIRECT || '/');
    });
};

// Provide user profile after Google auth (if needed in popup flows)
const googleProfile = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar,
  });
};

module.exports = {
  registerAdmin,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  googleAuthStart,
  googleAuthCallback,
  googleProfile,
};
