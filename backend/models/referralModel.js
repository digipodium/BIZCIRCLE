const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, // Optional internal recipient
    candidateName: { 
        type: String, 
        required: true 
    },
    candidateEmail: { 
        type: String, 
        required: true 
    },
    targetCircle: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Circle' 
    },
    role: { 
        type: String 
    },
    message: { 
        type: String 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Successful', 'Rejected'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model("Referral", referralSchema);
