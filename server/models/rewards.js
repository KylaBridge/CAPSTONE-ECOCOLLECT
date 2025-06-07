const mongoose = require("mongoose");
const { Schema } = mongoose;

const rewardSchema = new Schema({
    name: { 
        type: String, 
        required: true
    },
    category: { 
        type: String, 
        required: true 
    },
    points: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    image: {
        name: String,
        path: String,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("Reward", rewardSchema);