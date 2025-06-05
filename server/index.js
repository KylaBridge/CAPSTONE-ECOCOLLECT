const express = require("express")
require("dotenv").config()
const cors = require('cors')
const app = express()
const path = require("path")
const { mongoose } = require("mongoose")
const cookieParser = require("cookie-parser")

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
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

//database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
     app.listen(process.env.PORT, () => {console.log('DB connected and Server is running on', process.env.PORT)})
    })
    .catch((err) => console.log("Database Not Connected", err))