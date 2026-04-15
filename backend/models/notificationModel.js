const { Schema, model, Types } = require('../connection');

/**
 * Notification Types by Category:
 * ─────────────────────────────────────────────────────
 * REFERRAL       : referral_sent | referral_received | referral_accepted | referral_completed
 * CONNECTION     : connection_request | connection_accepted | connection_mutual
 * MESSAGING      : new_message | group_mention | group_reply
 * OPPORTUNITY    : job_posted | internship_posted | opportunity_match
 * EVENT          : event_created | event_reminder | event_cancelled | event_rsvp_update
 * ACHIEVEMENT    : badge_earned | points_milestone | rank_up | streak_reward
 * ANNOUNCEMENT   : admin_announcement | system_alert | policy_update
 * REMINDER       : profile_incomplete | circle_inactive | event_soon | referral_pending
 * ─────────────────────────────────────────────────────
 * Priority: high | medium | low
 */

const notifSchema = new Schema(
  {
    // Recipient
    recipient: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Who triggered it (null for system/admin notifications)
    sender: {
      type: Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Category enum — used for grouping in the UI
    category: {
      type: String,
      enum: [
        'referral',
        'connection',
        'messaging',
        'opportunity',
        'event',
        'achievement',
        'announcement',
        'reminder',
      ],
      required: true,
    },

    // Specific action within the category
    type: {
      type: String,
      enum: [
        // referral
        'referral_sent',
        'referral_received',
        'referral_accepted',
        'referral_completed',
        // connection
        'connection_request',
        'connection_accepted',
        'connection_mutual',
        // messaging
        'new_message',
        'group_mention',
        'group_reply',
        // opportunity
        'job_posted',
        'internship_posted',
        'opportunity_match',
        // event
        'event_created',
        'event_reminder',
        'event_cancelled',
        'event_rsvp_update',
        // achievement
        'badge_earned',
        'points_milestone',
        'rank_up',
        'streak_reward',
        // announcement
        'admin_announcement',
        'system_alert',
        'policy_update',
        // reminder
        'profile_incomplete',
        'circle_inactive',
        'event_soon',
        'referral_pending',
      ],
      required: true,
    },

    // Human-readable message shown in the UI
    message: {
      type: String,
      required: true,
      maxlength: 300,
    },

    // Priority for ordering and visual treatment
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },

    // Read/unread state
    isRead: {
      type: Boolean,
      default: false,
    },

    // Deep-link: where to navigate on click
    // e.g. "/groups/123", "/profile/456", "/dashboard/my-circles"
    linkTo: {
      type: String,
      default: null,
    },

    // Optional metadata for dynamic content (e.g. groupName, badgeName, points)
    meta: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

// Compound index for fast per-user queries sorted by time
notifSchema.index({ recipient: 1, createdAt: -1 });
// Index for unread counts
notifSchema.index({ recipient: 1, isRead: 1 });

module.exports = model('Notification', notifSchema);
