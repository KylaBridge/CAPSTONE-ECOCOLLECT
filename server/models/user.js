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
    }
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel