const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: String,
  googleId: {
    type: String,
    index: true,
    unique: true,
    sparse: true,
  },
  name: String,
  avatar: String,
  role: {
    type: String,
    default: "user",
  },
  exp: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: "Unranked",
  },
  rankEarnedAt: {
    type: Date,
    default: null,
  },
  badgeHistory: [{
    badgeName: {
      type: String,
      required: true,
    },
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    pointsRequired: {
      type: Number,
      required: true,
    }
  }],
  points: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
