const mongoose = require('mongoose');
const { Schema } = mongoose;

const badgeSchema = new Schema({
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

module.exports = mongoose.model('Badge', badgeSchema);