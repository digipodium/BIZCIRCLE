const mongoose = require("mongoose");

const circleSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  domain:         { type: String, required: true },
  relatedDomains: [{ type: String }],
  location:       { type: String, required: true },
  description:    { type: String, default: "" },
  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members:        [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  memberCount:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Circle", circleSchema);