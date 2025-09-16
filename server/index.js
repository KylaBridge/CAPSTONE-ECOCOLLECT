const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
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

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Deployed " });
});
app.use("/api/ecocollect", require("./routes/controllerRoutes"));
app.use("/api/ecocollect/auth", require("./routes/authRoutes"));
app.use("/uploads", express.static("uploads"));

//database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("DB connected and Server is running on", process.env.PORT);
    });
  })
  .catch((err) => console.log("Database Not Connected", err));
