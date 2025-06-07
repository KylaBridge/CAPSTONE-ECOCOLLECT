const mongoose = require('mongoose');
const { Schema } = mongoose;

const binSchema = new Schema({
    location: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Full', 'Available', 'Needs Emptying'],
        required: true 
    },
    remarks: { 
        type: String, 
        default: '' 
    },
    image: { 
        type: String, 
        default: null 
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