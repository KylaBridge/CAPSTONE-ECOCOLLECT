const mongoose = require("mongoose");

const ewasteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  attachments: [
    {
      name: String,
      path: String,
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EWaste", ewasteSchema);
