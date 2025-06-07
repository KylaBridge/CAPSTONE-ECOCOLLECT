const mongoose = require("mongoose");
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ewasteSchema = new Schema({
    id: { 
        type: Number, 
        unique: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    attachments: [
        {
        name: String,
        path: String,
        }
    ],
    status: { 
        type: String, 
        default: "Pending", 
        enum: ["Pending", "Approved", "Rejected"] 
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

ewasteSchema.plugin(AutoIncrement, { inc_field: 'id', id: 'ewaste_id' });

module.exports = mongoose.model("EWaste", ewasteSchema);