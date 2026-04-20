const AdminNotification = require('../models/adminNotificationModel');

// Fetch latest notifications for admin
const getAdminNotifications = async (req, res) => {
    try {
        const notifications = await AdminNotification.find()
            .sort({ createdAt: -1 })
            .limit(10); // Fetch a few more than 6 just in case

        const unreadCount = await AdminNotification.countDocuments({ isRead: false });

        res.json({ notifications, unreadCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await AdminNotification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: "Notification not found" });
        res.json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper to create admin notification (internal use)
const createAdminNotification = async (message, type, priority = 'medium') => {
    try {
        const notification = await AdminNotification.create({
            message,
            type,
            priority
        });
        return notification;
    } catch (err) {
        console.error("Create Admin Notification Error:", err);
    }
};

// Test API to generate dummy notifications
const generateTestNotifications = async (req, res) => {
    try {
        const tests = [
            { message: "New user registered", type: "user_registered", priority: "low" },
            { message: "3 reports pending review", type: "report_pending", priority: "high" },
            { message: "User flagged multiple times", type: "user_flagged", priority: "medium" },
            { message: "New group created", type: "group_created", priority: "low" },
            { message: "System configuration updated", type: "system_config", priority: "medium" },
        ];

        for (const t of tests) {
            await createAdminNotification(t.message, t.type, t.priority);
        }

        res.json({ success: true, message: "Test notifications generated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAdminNotifications,
    markAsRead,
    createAdminNotification,
    generateTestNotifications
};
