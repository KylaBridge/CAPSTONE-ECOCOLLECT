const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const activityLogSchema = new Schema({
    id: {
        type: Number,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true,
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

activityLogSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'activitylog_id' });

module.exports = mongoose.model('ActivityLog', activityLogSchema);