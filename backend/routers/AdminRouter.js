const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { 
    getDashboardStats, 
    getAllUsers, 
    updateUserStatus, 
    updateUserRole, 
    getLogs 
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

// System Logs
router.get('/logs', getLogs);

module.exports = router;
