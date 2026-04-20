// backend/models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: false }, // Optional for Google Auth users
  googleId: { type: String, unique: true, sparse: true }, // Sparse allows multiple nulls
  bio: String,
  skills: [{ type: String }],
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  organization: String,

  // Extended profile fields
  phone: String,
  dob: String,
  location: String,
  website: String,
  github: String,
  linkedin: String,
  profilePicture: String,
  headline: String,

  // Professional details
  experience: [
    {
      role: String,
      company: String,
      period: String,
      type: { type: String },
      desc: String,
    },
  ],
  projects: [
    {
      name: String,
      desc: String,
      stack: String,
      link: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      period: String,
      grade: String,
    },
  ],

  // Circles (already existed)
  circles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Circle",
    },
  ],

  // ── NEW FIELDS BELOW ──────────────────────────────

  // Set automatically when user joins their first circle
  // Used to enforce the domain similarity rule
  primaryDomain: {
    type: String,
    default: "",
  },

  // People this user is connected with
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  // Count of referrals given — increment with $inc when a referral is sent
  referralsGiven: {
    type: Number,
    default: 0,
  },

  // Content Moderation
  warningCount: {
    type: Number,
    default: 0,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },

  points: {
    type: Number,
    default: 0,
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);