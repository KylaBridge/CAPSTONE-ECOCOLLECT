const mongoose= require("mongoose");

const rewardsSchema = new mongoose.Schema({
    name: String,
    price: Number,
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("Rewards", rewardsSchema);