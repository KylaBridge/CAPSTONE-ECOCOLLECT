const mongoose = require("mongoose");
const { Schema } = mongoose;

const ewasteSchema = new Schema({
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

module.exports = mongoose.model("EWaste", ewasteSchema);