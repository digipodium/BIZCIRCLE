const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAsUnread,
    markAllRead,
    deleteNotification,
    clearAll,
} = require('../controllers/notificationController');

// All routes require authentication
router.get('/', auth, getNotifications);                      // GET  /api/notifications
router.get('/unread-count', auth, getUnreadCount);            // GET  /api/notifications/unread-count
router.put('/mark-all-read', auth, markAllRead);              // PUT  /api/notifications/mark-all-read
router.delete('/clear-all', auth, clearAll);                  // DELETE /api/notifications/clear-all
router.put('/:id/read', auth, markAsRead);                    // PUT  /api/notifications/:id/read
router.put('/:id/unread', auth, markAsUnread);                // PUT  /api/notifications/:id/unread
router.delete('/:id', auth, deleteNotification);              // DELETE /api/notifications/:id

module.exports = router;
