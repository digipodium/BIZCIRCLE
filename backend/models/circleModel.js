const mongoose = require("mongoose");
const circleSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  description:    { type: String, default: "" },
  domain:         { type: String, required: true },
  relatedDomains: [{ type: String }],
  location:       { type: String, required: true },
  icon:           { type: String, default: '💻' },
  color:          { type: String, default: 'from-blue-500 to-blue-700' },
  logo:           { type: String, default: '' },
  rules:          { type: String, default: '' },
  isPrivate:      { type: Boolean, default: false },
  status:         { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  memberCount:    { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Circle", circleSchema);