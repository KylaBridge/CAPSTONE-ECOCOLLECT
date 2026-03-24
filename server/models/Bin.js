const mongoose = require("mongoose");
const { Schema } = mongoose;
const Counter = require("./counter");

const binSchema = new Schema({
  autoId: { type: Number, unique: true, index: true },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Full", "Available", "Needs Emptying"],
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: null,
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

binSchema.pre("save", async function (next) {
  if (this.isNew && this.autoId == null) {
    const ret = await Counter.findOneAndUpdate(
      { _id: "Bin" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.autoId = ret.seq;
  }
  next();
});

module.exports = mongoose.model("Bin", binSchema);
