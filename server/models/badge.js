const mongoose = require("mongoose");
const { Schema } = mongoose;
const Counter = require("./counter");

const badgeSchema = new Schema({
  autoId: { type: Number, unique: true, index: true },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  milestoneCondition: {
    type: String,
    required: true,
    trim: true,
  },
  pointsRequired: {
    type: Number,
    required: true,
    min: 0,
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

badgeSchema.pre("save", async function (next) {
  if (this.isNew && this.autoId == null) {
    const ret = await Counter.findOneAndUpdate(
      { _id: "Badge" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.autoId = ret.seq;
  }
  next();
});

module.exports = mongoose.model("Badge", badgeSchema);
