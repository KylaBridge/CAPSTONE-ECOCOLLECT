const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  points: { type: Number, required: true },
  description: { type: String, required: true },
  image: {
    name: String,
    path: String,
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reward", rewardSchema);