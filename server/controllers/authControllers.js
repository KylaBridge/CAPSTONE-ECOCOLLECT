const User = require("../models/user");
const { comparePassword, hashPassword } = require("../helpers/auth");
const { signToken, verifyToken } = require("../helpers/jwt");
const { sendVerificationEmail } = require("../helpers/mail");
const passport = require("passport");

// Register Email and Name
const registerEmailName = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name)
      return res.status(400).json({ error: "Missing fields" });

    const exists = await User.findOne({ email });

    if (exists) return res.status(400).json({ error: "Email Already Exists" });

    const tempToken = await signToken({ email, name }, { expiresIn: "5m" });

    return res.status(200).json({ message: "Email Accepted", tempToken });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Register Password
const registerPassword = async (req, res) => {
  try {
    const { password, tempToken } = req.body;

    if (!tempToken)
      return res.status(400).json({ error: "Missing temp token" });
    if (!password) return res.status(400).json({ error: "Password required" });

    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (
      password.length < 10 ||
      !specialCharRegex.test(password) ||
      !/\d/.test(password)
    ) {
      return res
        .status(400)
        .json({ error: "Password does not meet requirements" });
    }

    let decoded;
    try {
      decoded = await verifyToken(tempToken);
    } catch {
      return res
        .status(400)
        .json({ error: "Expired or invalid registration token" });
    }

    const { email, name } = decoded;
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (e) {
      return res.status(500).json({ error: "Failed to send email" });
    }

    const newTempToken = await signToken(
      { password, email, name, verificationCode },
      { expiresIn: "5m" }
    );

    return res.status(200).json({ message: "Password accepted", newTempToken });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

// Register User (final step)
const registerUser = async (req, res) => {
  try {
    const { code, newTempToken, role } = req.body;

    if (!code || !newTempToken)
      return res.status(400).json({ error: "Missing code or token" });

    let decoded;
    try {
      decoded = await verifyToken(newTempToken);
    } catch {
      return res
        .status(400)
        .json({ error: "Expired or invalid verification token" });
    }

    const { verificationCode, email, name, password } = decoded;

    if (code !== verificationCode)
      return res.status(400).json({ error: "Invalid verification code" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      role,
    });
    const { password: pwd, ...userWithoutPassword } = user.toObject();

    return res
      .status(201)
      .json({ message: "Account Registered", user: userWithoutPassword });
  } catch (error) {
    return res.status(500).json(error);
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
              message:
                user.role === "admin" ? "User is an admin" : "User logged in",
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
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
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
const googleAuthStart = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
});

// Google OAuth callback handler (after passport authenticates)
const googleAuthCallback = (req, res) => {
  const user = req.user;
  if (!user) return res.redirect(`${process.env.FRONTEND_URL}/login`);
  signToken({ email: user.email, id: user._id })
    .then((token) => {
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/",
        maxAge: 1000 * 60 * 30,
      });
      const base = process.env.FRONTEND_URL;
      const redirectUrl = `${base.replace(/\/$/, "")}/home/?auth=google`;
      res.redirect(redirectUrl);
    })
    .catch((err) => {
      console.error("JWT sign error", err);
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    });
};

// Provide user profile after Google auth (if needed in popup flows)
const googleProfile = (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar,
  });
};

module.exports = {
  registerEmailName,
  registerPassword,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  googleAuthStart,
  googleAuthCallback,
  googleProfile,
};
