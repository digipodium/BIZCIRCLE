const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mytopseret');
        
        // Check if user is blocked
        const user = await User.findById(decoded.id).select('isBlocked role');
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account has been blocked due to policy violations' });
        }

        req.user = decoded; // { id: userId, role: 'user/admin' }
        // Ensure role is up to date in request object
        req.user.role = user.role;
        
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;
