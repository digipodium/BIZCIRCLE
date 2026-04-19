const Notification = require('../models/notificationModel');

// Helper to create notification and emit real-time event
const createNotification = async (io, { userId, type, category = 'reminder', message, priority = 'medium' }) => {
    try {
        const notification = await Notification.create({
            userId,
            type,
            category,
            message,
            priority
        });

        // Emit real-time update via socket.io
        if (io) {
            io.to(`user_${userId}`).emit('new_notification', notification);
        }

        return notification;
    } catch (err) {
        console.error("Create Notification Error:", err);
        throw err;
    }
};

// GET /api/notifications
// Fetch notifications for logged-in user
const getNotifications = async (req, res) => {
    try {
        const { filter } = req.query; // 'all' or 'unread'
        let query = { userId: req.user.id };

        if (filter === 'unread') {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 });

        res.json({ notifications, unreadCount: notifications.filter(n => !n.read).length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PATCH /api/notifications/:id/read
// Mark as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { read: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: "Notification not found" });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PATCH /api/notifications/mark-all-read
const markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
        res.json({ success: true, message: "All marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const markAsUnread = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { read: false },
            { new: true }
        );
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const clearAll = async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user.id });
        res.json({ success: true, message: "All notifications cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/notifications/test
// Manually trigger a notification for testing
const testCreateNotification = async (req, res) => {
    try {
        const { userId, type, category, message, priority } = req.body;
        const io = req.app.get('io');

        const notification = await createNotification(io, {
            userId,
            category: category || 'reminder',
            type: type || 'test',
            message: message || 'This is a test notification!',
            priority: priority || 'medium'
        });

        res.status(201).json({ success: true, notification });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    markAsUnread,
    markAllRead,
    deleteNotification,
    clearAll,
    testCreateNotification
};

