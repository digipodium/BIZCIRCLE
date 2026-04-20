/**
 * Middleware to check if the authenticated user has the required roles.
 * Must be used AFTER the auth middleware.
 * 
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            console.warn(`[AUTH] Access denied for ${req.user.email}. Role: ${req.user.role}, Required: ${allowedRoles}`);
            return res.status(403).json({ 
                message: 'Forbidden: You do not have permission to perform this action' 
            });
        }

        next();
    };
};

module.exports = checkRole;
