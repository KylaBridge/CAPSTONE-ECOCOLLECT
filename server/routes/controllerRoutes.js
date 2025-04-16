const express = require("express")
const router =  express.Router()
const multer = require("multer");
const path = require("path");
const { getUserData, deleteUser, submitEWaste, getUserSubmissions } = require('../controllers/dataControllers')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // this folder should exist or be created
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage: storage });

router.get("/usermanagement", getUserData)
router.delete("/usermanagement/:id", deleteUser)
router.post("/ewaste", upload.array("attachments", 5), submitEWaste);
router.get("/ewaste/user/:userId", getUserSubmissions);

module.exports = router