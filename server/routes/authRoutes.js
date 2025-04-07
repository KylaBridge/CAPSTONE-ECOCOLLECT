const express = require("express")
const router =  express.Router()
const { test, registerUser, loginUser, getProfile, logoutUser } = require("../controllers/authControllers")

router.get("/home", test)
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile", getProfile)
router.post("/logout", logoutUser);

module.exports = router