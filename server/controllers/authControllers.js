const User = require("../models/user")
const { comparePassword, hashPassword } = require("../helpers/auth")
const jwt = require("jsonwebtoken")

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

        // Creates the user in the database
        const hashedPassword = await hashPassword(password)
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
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "No user found" });
        }

        // Check if passwords match
        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign(
                { email: user.email, id: user._id },
                process.env.JWT_SECRET,
                {},
                (err, token) => {
                    if (err) throw err;
                    res.cookie("token", token, {
                        httpOnly: true,
                        sameSite: "lax", // or "none" if cross-origin
                        secure: process.env.NODE_ENV === "production"
                    }).json({
                        message: user.role === "admin" ? "User is an admin" : "User logged in",
                        _id: user._id,
                        role: user.role,
                        name: user.name,
                        email: user.email,
                        exp: user.exp,
                        points: user.points,
                        rank: user.rank
                    });
                }
            );
        } else {
            res.json({ error: "Password does not match" });
        }
    } catch (error) {
        console.log(error);
    }
};

const getProfile = async (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
            if (err) throw err;
            const user = await User.findById(decoded.id);
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                exp: user.exp,
                points: user.points,
                rank: user.rank
            });
        });
    } else {
        res.json(null);
    }
};

const logoutUser = (req, res) => {
    res.clearCookie("token")
    res.json({ message: "Logged out successfully" })
};

module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
}