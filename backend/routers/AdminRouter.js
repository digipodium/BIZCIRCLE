const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
    getDashboardStats, 
    getAllUsers, 
    updateUserStatus, 
    updateUserRole, 
    getLogs,
    getAllReports,
    updateReportStatus,
    getAllMessages,
    deleteMessage,
    getAdminNotifications,
    markAdminNotificationRead
} = require('../controllers/adminController');

// Middleware to verify admin privileges
const authAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

// Protect all admin routes
router.use(auth);
router.use(authAdmin);

// Dashboard Overview
router.get('/dashboard', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);

// Reports Management
router.get('/reports', getAllReports);
router.put('/reports/:id/status', updateReportStatus);

// Content Moderation
router.get('/messages', getAllMessages);
router.delete('/messages/:id', deleteMessage);

// Admin Notifications
router.get('/notifications', getAdminNotifications);
router.patch('/notifications/:id/read', markAdminNotificationRead);

// System Logs
router.get('/logs', getLogs);

module.exports = router;
