const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const badgeSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
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

badgeSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'badge_id' });

module.exports = mongoose.model('Badge', badgeSchema);