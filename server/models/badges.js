const mongoose = require("mongoose")
const { Schema } = mongoose

const badgeScheme = new Schema({
    name:  {
        type: String,
        unique: true,
        required: true,
    },
    
    description:{
        type: String,
        required: true,
    },

    pointsRequired:{
        type: Number,
        required: true,
    },

    iconPath:{
        type: String,
        required: true,
    }

})