const mongoose = require('mongoose');
const { Schema } = mongoose;

const redemptionSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rewardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward',
        required: true
    },
    rewardName: {
        type: String,
        required: true
    },
    redemptionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Issued', 'Claimed', 'Expired'],
        default: 'Issued'
    },
    expiresAt: {
        type: Date,
        required: true
    },
    pointsSpent: {
        type: Number,
        required: true
    },
    claimedAt: {
        type: Date
    },
    redemptionId: {
        type: String,
        unique: true,
        required: true
    },
    note: {
        type: String
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

module.exports = mongoose.model('Redemption', redemptionSchema);