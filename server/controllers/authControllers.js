const User = require("../models/user")
const { comparePassword, hashPassword } = require("../helpers/auth")

const test = (req, res) => {
    res.json("test is working")
}

// Register user
const registerUser = async (req, res) => {
    try {
        const {email, password} = req.body
        // Check if email exists
        const exist = await User.findOne({email})
        if(exist) {
            return res.json({
                error: "Email is already taken"
            })
        }
        // Check if password is good
        if(!password || password.length < 6 ) {
            return res.json({
                error: "password should be atleast 6 characters long"
            })
        }
        const hashedPassword = await hashPassword(password)
        // Creates the user in the database
        const user = await User.create({
            email, 
            password: hashedPassword,
        })
        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check if the user exists
        const user = await User.findOne({email})
        if(!user) {
            return res.json({error: "No user found"})
        }

        // Check if user is an admin
        if (user.role === "admin") {
            return res.json({
                message: "User is an admin",
                user
            });
        }
        
        // Check if passwords match
        const match = await comparePassword(password, user.password)
        if(match) {
            res.json("password match")
        } else {
            res.json({error: "Password do not match"})
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    test,
    registerUser,
    loginUser,
}