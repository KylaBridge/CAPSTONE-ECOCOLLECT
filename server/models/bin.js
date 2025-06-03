const mongoose = require('mongoose');

const binSchema = new mongoose.Schema ({
  location: {
    type: String,
    required: true,
    unique: true
  },
  remarks: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Available', 'Full'],
    default: 'Available'
  },
  image: {
    type: String,
    path: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bin', binSchema);