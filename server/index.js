const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const path = require("path");
const { startCronJobs } = require("./cronJobs");
const {
  securityHeaders,
  blockSensitiveFiles,
  additionalHSTS,
} = require("./middleware/cspMiddleware");

// Middleware
app.use(express.json({ limit: "10mb" })); // Add size limit
app.use(cookieParser());
app.use(express.urlencoded({ extended: false, limit: "10mb" })); // Add size limit
app.use(passport.initialize());
app.use(
  cors({
    // Allow all origins for development

    // If deployment use specific allowed origins
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// Serve static uploads BEFORE security middleware to avoid CSP blocking
app.use("/uploads", express.static("uploads"));

// Security middleware (after uploads to avoid blocking static files)
app.use(securityHeaders);
app.use(additionalHSTS);
app.use(blockSensitiveFiles);

// Serve static files from the dist folder inside server with proper headers
app.use(express.static(path.join(__dirname, "dist")));

// routes
app.use("/api/ecocollect/auth", require("./routes/authRoutes"));
app.use("/api/ecocollect/ewaste", require("./routes/ewasteRoutes"));
app.use("/api/ecocollect/user", require("./routes/userRoutes"));
app.use("/api/ecocollect/usermanagement", require("./routes/userManageRoutes"));
app.use("/api/ecocollect/rewards", require("./routes/rewardsRoutes"));
app.use("/api/ecocollect/redeem", require("./routes/redemptionRoutes"));
app.use("/api/ecocollect/badges", require("./routes/badgeRoutes"));
app.use("/api/ecocollect/bins", require("./routes/binRoutes"));
app.use("/api/ecocollect/activity-logs", require("./routes/activityLogRoutes"));
app.use("/api/ecocollect/contact", require("./routes/contactRoutes"));

// Catch-all: serve index.html for SPA (after API routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

//database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected");

    // Start cron jobs after database connection
    startCronJobs();

    app.listen(process.env.PORT, () => {
      console.log("Server is running on", process.env.PORT);
    });
  })
  .catch((err) => console.log("Database Not Connected", err));
