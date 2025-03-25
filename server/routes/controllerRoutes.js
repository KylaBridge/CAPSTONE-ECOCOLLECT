const express = require("express")
const router =  express.Router()
const { getUserData, deleteUser } = require('../controllers/dataControllers')

router.get("/usermanagement", getUserData)
router.delete("/usermanagement/:id", deleteUser)

module.exports = router