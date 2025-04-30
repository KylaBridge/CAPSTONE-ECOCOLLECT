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
    rank: {
        type: String,
        default: "Eco Starter"
    },
    points: {
        type: Number,
        default: 0
    }
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel