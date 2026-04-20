const { Schema, model, Types } = require('../connection');

const notificationSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      default: 'reminder',
    },
    // type: 'referral_sent', 'new_message', etc.
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // priority: 'low', 'medium', 'high'
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast fetching and unread counts
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

module.exports = model('Notification', notificationSchema);
