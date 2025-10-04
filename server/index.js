const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
const path = require("path");
const { startCronJobs } = require("./cronJobs");

// Security headers middleware
app.use((req, res, next) => {
  // Prevent content type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Content Security Policy - Allow Google Fonts and necessary resources
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://accounts.google.com;"
  );
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' })); // Add size limit
app.use(cookieParser());
app.use(express.urlencoded({ extended: false, limit: '10mb' })); // Add size limit
app.use(passport.initialize());
app.use(
  cors({
    // Allow all origins for development

    // If deployment use specific allowed origins
    // process.env.FRONTEND_URL; web app URL
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Serve static files from the dist folder inside server
app.use(express.static(path.join(__dirname, "dist")));

// routes
app.use("/api/ecocollect", require("./routes/controllerRoutes"));
app.use("/api/ecocollect/auth", require("./routes/authRoutes"));
app.use("/uploads", express.static("uploads"));

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
