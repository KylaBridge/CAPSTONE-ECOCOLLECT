const mongoose = require("mongoose");
const { Schema } = mongoose;
const Counter = require("./counter");

const redemptionSchema = new Schema({
  autoId: { type: Number, unique: true, index: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rewardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reward",
    required: true,
  },
  rewardName: {
    type: String,
    required: true,
  },
  redemptionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Issued", "Claimed", "Expired"],
    default: "Issued",
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  pointsSpent: {
    type: Number,
    required: true,
  },
  claimedAt: {
    type: Date,
  },
  redemptionId: {
    type: String,
    unique: true,
    required: true,
  },
  note: {
    type: String,
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

redemptionSchema.pre("save", async function (next) {
  if (this.isNew && this.autoId == null) {
    const ret = await Counter.findOneAndUpdate(
      { _id: "Redemption" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.autoId = ret.seq;
  }
  next();
});

module.exports = mongoose.model("Redemption", redemptionSchema);
