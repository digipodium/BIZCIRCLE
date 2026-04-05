const { Schema, model } = require('../connection');

const mySchema = new Schema({
    // EXISTING FIELDS (KEEP)
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },

    // ───────── PROFILE INFO ─────────
    phone: { type: String },
    dob: { type: String },
    gender: { type: String },
    location: { type: String },
    bio: { type: String },

    // ───────── PROFESSIONAL DETAILS ─────────
    designation: { type: String },
    company: { type: String },
    experience: { type: String },

    // ───────── ARRAYS (IMPORTANT) ─────────
    skills: { type: [String], default: [] },
    industry: { type: [String], default: [] },

    // ───────── DOMAINS & INTERESTS ─────────
    primaryDomain: { type: [String], default: [] },
    secondaryInterests: { type: [String], default: [] },
    networking: { type: [String], default: [] },
    topics: { type: [String], default: [] }

}, { timestamps: true });

module.exports = model('users', mySchema);