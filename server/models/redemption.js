const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const redemptionSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

redemptionSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'redemption_id' });

module.exports = mongoose.model('Redemption', redemptionSchema);