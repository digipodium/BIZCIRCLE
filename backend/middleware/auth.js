const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        const token = authHeader?.replace('Bearer ', '');
        
        if (!token) {
            // Log only in development to reduce noise
            if (process.env.NODE_ENV === 'development') {
                console.log('[AUTH] No token provided for:', req.method, req.path);
            }
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mytopseret');
        req.user = decoded; // { id: userId, role: 'user/admin' }
        next();
    } catch (err) {
        console.error('[AUTH] Token verification failed:', err.message);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = auth;
