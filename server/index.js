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
        origin: "http://localhost:5175",
    })
)

// Routes
app.use("/api/ecocollect", require("./routes/controllerRoutes"))
app.use("/api/ecocollect/auth", require("./routes/authRoutes"))
app.use("/uploads", express.static("uploads"));

// database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {console.log('DB connected and Server is running on', process.env.PORT)})
    })
    .catch((err) => console.log("Database Not Connected", err))