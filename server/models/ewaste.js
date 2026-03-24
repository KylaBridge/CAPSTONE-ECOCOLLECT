const mongoose = require("mongoose");
const { Schema } = mongoose;
const Counter = require("./counter");

const ewasteSchema = new Schema({
  autoId: { type: Number, unique: true, index: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  attachments: [
    {
      name: String,
      path: String,
    },
  ],
  originalAttachmentCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Approved", "Rejected"],
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

ewasteSchema.pre("save", async function (next) {
  if (this.isNew && this.autoId == null) {
    const ret = await Counter.findOneAndUpdate(
      { _id: "EWaste" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.autoId = ret.seq;
  }
  next();
});

module.exports = mongoose.model("EWaste", ewasteSchema);
