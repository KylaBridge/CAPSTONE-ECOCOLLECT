const express = require("express")
require("dotenv").config()
const cors = require('cors')
const app = express()
const { mongoose } = require("mongoose")
const cookieParser = require("cookie-parser")

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL || "http://localhost:5175",
    })
)

// Routes
app.use("/api/ecocollect", require("./routes/controllerRoutes"))
app.use("/api/ecocollect/auth", require("./routes/authRoutes"))
app.use("/uploads", express.static("uploads"));

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// database connection
const PORT = process.env.PORT || 10000;

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database Connection Error:", err);
        process.exit(1);
    });