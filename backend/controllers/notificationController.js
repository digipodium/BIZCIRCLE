const Notification = require('../models/notificationModel');

// ══════════════════════════════════════════════════════════════
// HELPER: create a notification and optionally push via Socket.io
// ══════════════════════════════════════════════════════════════

/**
 * createNotification({ io, recipient, sender, category, type, message, priority, linkTo, meta })
 *
 * Call this from any route/controller whenever a notification-worthy event occurs.
 * `io` is optional — pass it in if you want real-time push.
 */
const createNotification = async ({ io, recipient, sender = null, category, type, message, priority = 'medium', linkTo = null, meta = {} }) => {
    const notif = await Notification.create({
        recipient,
        sender,
        category,
        type,
        message,
        priority,
        linkTo,
        meta,
    });

    // Real-time push via Socket.io (if io instance is provided and user is connected)
    if (io) {
        // The frontend joins a personal room: socket.join(`user_${userId}`)
        io.to(`user_${recipient.toString()}`).emit('notification', notif);
    }

    return notif;
};

// ══════════════════════════════════════════════════════════════
// GET /api/notifications — paginated, optional filter by category/read
// ══════════════════════════════════════════════════════════════
const getNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const filter = { recipient: req.user.id };
        if (req.query.category) filter.category = req.query.category;
        if (req.query.unread === 'true') filter.isRead = false;

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(filter)
                .sort({ priority: 1, createdAt: -1 }) // high first, then newest
                .skip(skip)
                .limit(limit)
                .populate('sender', 'name profilePicture headline')
                .lean(),
            Notification.countDocuments(filter),
            Notification.countDocuments({ recipient: req.user.id, isRead: false }),
        ]);

        // Sort so "high" priority comes first within the result set
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        notifications.sort((a, b) => {
            const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (pDiff !== 0) return pDiff;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json({
            notifications,
            unreadCount,
            pagination: {
                page,
                limit,
                total,
                hasMore: skip + notifications.length < total,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ══════════════════════════════════════════════════════════════
// GET /api/notifications/unread-count
// ══════════════════════════════════════════════════════════════
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user.id,
            isRead: false,
        });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ══════════════════════════════════════════════════════════════
// PUT /api/notifications/:id/read — mark single as read
// ══════════════════════════════════════════════════════════════
const markAsRead = async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { isRead: true },
            { new: true }
        );
        if (!notif) return res.status(404).json({ message: 'Notification not found' });
        res.json(notif);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ══════════════════════════════════════════════════════════════
// PUT /api/notifications/:id/unread — mark single as unread
// ══════════════════════════════════════════════════════════════
const markAsUnread = async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { isRead: false },
            { new: true }
        );
        if (!notif) return res.status(404).json({ message: 'Notification not found' });
        res.json(notif);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ══════════════════════════════════════════════════════════════
// PUT /api/notifications/mark-all-read
// ══════════════════════════════════════════════════════════════
const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ══════════════════════════════════════════════════════════════
// DELETE /api/notifications/:id
// ══════════════════════════════════════════════════════════════
const deleteNotification = async (req, res) => {
    try {
        const notif = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.id,
        });
        if (!notif) return res.status(404).json({ message: 'Notification not found' });
        res.json({ message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ══════════════════════════════════════════════════════════════
// DELETE /api/notifications/clear-all
// ══════════════════════════════════════════════════════════════
const clearAll = async (req, res) => {
    try {
        await Notification.deleteMany({ recipient: req.user.id });
        res.json({ message: 'All notifications cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAsUnread,
    markAllRead,
    deleteNotification,
    clearAll,
};
