const mongoose = require("mongoose");
const { Schema } = mongoose;
const Counter = require("./counter");

const activityLogSchema = new Schema({
  autoId: { type: Number, unique: true, index: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
    enum: ["user", "admin", "superadmin"],
  },
  action: {
    type: String,
    required: true,
    enum: [
      "Bin Added",
      "Bin Updated",
      "Bin Deleted",
      "EWaste Submitted",
      "EWaste Approved",
      "EWaste Rejected",
      "Badge Added",
      "Badge Updated",
      "Badge Deleted",
      "Reward Added",
      "Reward Updated",
      "Reward Deleted",
      "Reward Redeemed",
      "User Registered",
      "User Created",
      "User Deleted",
      "Admin Created",
      "User Role Change",
    ],
  },
  details: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

activityLogSchema.pre("save", async function (next) {
  if (this.isNew && this.autoId == null) {
    const ret = await Counter.findOneAndUpdate(
      { _id: "ActivityLog" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.autoId = ret.seq;
  }
  next();
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
