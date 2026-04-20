const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
    getAdminNotifications, 
    markAsRead, 
    generateTestNotifications 
} = require('../controllers/adminNotificationController');

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
    if (req.user && req.user.role?.toLowerCase() === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admin access only" });
    }
};

router.get('/', auth, adminAuth, getAdminNotifications);
router.patch('/:id/read', auth, adminAuth, markAsRead);
router.post('/generate-test', auth, adminAuth, generateTestNotifications);

module.exports = router;
