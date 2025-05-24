const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        default: "user"
    },
    exp: {
        type: Number,
        default: 0
    },
    rank: {
        type: String,
        default: "Beginner"
    },
    points: {
        type: Number,
        default: 0
    }
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel