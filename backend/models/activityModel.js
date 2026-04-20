const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "circle_joined",
        "circle_left",
        "referral_sent",
        "referral_received",
        "connection_sent",
        "connection_accepted",
        "post_created",
        "endorsement_received",
      ],
      required: true,
    },

    // The thing this activity is about (a Circle, User, Post, etc.)
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetModel",   // dynamic ref — uses targetModel to know which collection to look up
      default: null,
    },

    targetModel: {
      type: String,
      enum: ["Circle", "User", "Group"],
      default: null,
    },

    // Human-readable summary shown in the activity feed
    description: {
      type: String,
      default: "",
    },

    // Optional extra metadata (e.g. circle name, domain, referral role)
    meta: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }   // adds createdAt and updatedAt automatically
);

// Index so fetching a user's feed is fast
activitySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models?.Activity ||
  mongoose.model("Activity", activitySchema);