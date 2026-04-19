const { Schema, model, Types } = require('../connection');

const feedbackSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Main category of the report/feedback
    category: {
      type: String,
      enum: ['feedback', 'bug', 'report'],
      required: true,
    },
    // Sub-type (e.g. 'Suggestion', 'Appreciation', 'Fake Profile', 'Spam')
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // Optional details for bug reports
    title: String,
    stepsToReproduce: String,
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
    },
    // Optional details for feedback
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    // Optional details for user/content reports
    reportedUser: {
      type: Types.ObjectId,
      ref: 'User',
    },
    reportedUrl: String,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = model('Feedback', feedbackSchema);
