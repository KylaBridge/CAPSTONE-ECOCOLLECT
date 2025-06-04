const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
    location: { type: String, required: true },
    status: { type: String, enum: ['Full', 'Available', 'Needs Emptying'], required: true },
    remarks: { type: String, default: '' },
    image: { type: String, default: null },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bin', binSchema);
