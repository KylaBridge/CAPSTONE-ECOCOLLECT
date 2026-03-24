const mongoose = require("mongoose");
const { Schema } = mongoose;
const Counter = require("./counter");

const rewardSchema = new Schema({
  autoId: { type: Number, unique: true, index: true },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    name: String,
    path: String,
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

rewardSchema.pre("save", async function (next) {
  if (this.isNew && this.autoId == null) {
    const ret = await Counter.findOneAndUpdate(
      { _id: "Reward" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.autoId = ret.seq;
  }
  next();
});

module.exports = mongoose.model("Reward", rewardSchema);
