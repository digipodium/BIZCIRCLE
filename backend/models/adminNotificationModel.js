const { Schema, model } = require('../connection');

const adminNotificationSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['user_registered', 'report_pending', 'user_flagged', 'group_created', 'system_config', 'test'],
      default: 'system_config'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model('AdminNotification', adminNotificationSchema);
