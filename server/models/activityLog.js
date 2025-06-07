const mongoose = require('mongoose');
const { Schema } = mongoose;

const activityLogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        required: true,
        enum: ['user', 'admin']
    },
    action: {
        type: String,
        required: true,
        enum: ['Bin Added', 'Bin Updated', 'Bin Deleted',
                'EWaste Submitted', 'EWaste Approved', 'EWaste Rejected',
                'Badge Added', 'Badge Updated', 'Badge Deleted',
                'Reward Added', 'Reward Updated', 'Reward Deleted', 'Reward Redeemed',
                'User Registered', 'User Deleted']
    },
    details: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);