const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  milestoneCondition: {
    type: String,
    required: true,
    trim: true
  },
  pointsRequired: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    name: String,
    path: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema); 