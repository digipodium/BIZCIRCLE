const mongoose = require('mongoose');

const circleMemberSchema = new mongoose.Schema({
    circle: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Circle', 
        required: true 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Member'], 
        default: 'Member' 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Banned'], 
        default: 'Pending' 
    }
}, { timestamps: true });

// Ensure a user can only have one membership record for a specific circle
circleMemberSchema.index({ circle: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('CircleMember', circleMemberSchema);
