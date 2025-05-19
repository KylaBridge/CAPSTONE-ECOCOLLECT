const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema({
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
}, {
    timestamps: true
});

// Index for faster queries
redemptionSchema.index({ userId: 1, redemptionDate: -1 });

const Redemption = mongoose.model('Redemption', redemptionSchema);

module.exports = Redemption;
