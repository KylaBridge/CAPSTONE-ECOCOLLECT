const express = require("express")
const router =  express.Router()
const { registerAdmin, registerUser, loginUser, getProfile, logoutUser } = require("../controllers/authControllers")

router.post("/register-admin", registerAdmin);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/logout", logoutUser);

module.exports = router