const User = require("../models/user")
const { comparePassword, hashPassword } = require("../helpers/auth")
const jwt = require("jsonwebtoken")

// Register admin
const registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email exists
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: "Email is already taken"
            });
        }

        // Check if password is good
        if (!password || password.length < 6) {
            return res.json({
                error: "Password should be at least 6 characters long"
            });
        }

        // Creates the admin user in the database
        const hashedPassword = await hashPassword(password);
        const admin = await User.create({
            email,
            password: hashedPassword,
            role: "admin" // Set role to admin
        });
        return res.json(admin);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
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
        const { email, password, isAdminLogin } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "No user found" });
        }

        // If this is an admin login, only allow admins
        if (isAdminLogin && user.role !== "admin") {
            return res.json({ error: "You are not authorized to access this page" });
        }

        // Check if passwords match
        const match = await comparePassword(password, user.password);
        if (match) {
            // Only set token if not admin login or user is admin
            if (!isAdminLogin || user.role === "admin") {
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
            }
        } else {
            res.json({ error: "Email or password is invalid" });
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
                role: user.role,
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
    registerAdmin,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
}