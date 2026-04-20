const User = require('../models/userModel');
const Group = require('../models/groupModel');
const Activity = require('../models/activityModel');
const Message = require('../models/messageModel');

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'Active' });
        const totalGroups = await Group.countDocuments();
        
        // Count posts from today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const postsToday = await Message.countDocuments({ createdAt: { $gte: today } });

        // Build MOCK_STATS format
        const stats = [
            { id: 'total-users', label: 'Total Users', value: totalUsers, icon: 'Users', color: '#2563eb', trend: '+0%' },
            { id: 'active-users', label: 'Active Users', value: activeUsers, icon: 'Activity', color: '#059669', trend: '+0%' },
            { id: 'total-groups', label: 'Total Groups', value: totalGroups, icon: 'Grid', color: '#7c3aed', trend: '+0' },
            { id: 'posts-today', label: 'Posts Today', value: postsToday, icon: 'FileText', color: '#ea580c', trend: '+0%' },
            { id: 'pending-reports', label: 'Pending Reports', value: 0, icon: 'AlertCircle', color: '#dc2626', trend: '0' },
        ];

        // Recent Activity
        const recentActivities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name')
            .lean();

        const formattedActivities = recentActivities.map((act) => {
            let type = 'user';
            const actType = act.type || '';
            if (actType.includes('circle') || actType.includes('group')) type = 'group';
            if (actType.includes('referral')) type = 'post';

            const timeDiff = Math.floor((new Date() - new Date(act.createdAt)) / 60000);
            let timeStr = `${timeDiff} mins ago`;
            if (timeDiff > 60) timeStr = `${Math.floor(timeDiff/60)} hours ago`;
            if (timeDiff > 1440) timeStr = `${Math.floor(timeDiff/1440)} days ago`;

            return {
                id: act._id,
                type,
                action: act.description || 'Action performed',
                target: act.userId?.name || 'System',
                time: timeStr
            };
        });

        // User Growth Data - naive mock fallback with real total
        const growthData = [
            { month: 'Jan', users: Math.max(0, totalUsers - 50) },
            { month: 'Feb', users: Math.max(0, totalUsers - 40) },
            { month: 'Mar', users: Math.max(0, totalUsers - 30) },
            { month: 'Apr', users: Math.max(0, totalUsers - 20) },
            { month: 'May', users: Math.max(0, totalUsers - 10) },
            { month: 'Jun', users: totalUsers },
        ];

        // Weekly Engagement Data (Last 7 days)
        const engagementStats = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            
            const nextDay = new Date(d);
            nextDay.setDate(d.getDate() + 1);

            const postsCount = await Message.countDocuments({
                createdAt: { $gte: d, $lt: nextDay }
            });
            const activityCount = await Activity.countDocuments({
                createdAt: { $gte: d, $lt: nextDay }
            });

            engagementStats.push({
                name: days[d.getDay()],
                posts: postsCount,
                likes: activityCount // Using activity as a proxy for engagement metric
            });
        }

        res.json({
            stats,
            recentActivity: formattedActivities,
            userGrowth: growthData,
            engagementStats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password').sort({ createdAt: -1 }).lean();
        const formattedUsers = users.map(user => {
            const date = new Date(user.createdAt);
            // "2026-04-19"
            const joined = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            
            const role = user.role || 'user';
            
            return {
                id: user._id,
                name: user.name || 'Unknown User',
                email: user.email || 'No email',
                role: role.charAt(0).toUpperCase() + role.slice(1), // "admin" -> "Admin"
                status: user.status || 'Active',
                joined: joined
            };
        });
        res.json(formattedUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Active', 'Suspended', 'Banned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json({ message: `User status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const validRoles = ['user', 'admin', 'moderator'];
        // Input validation handles capitalization differences
        const queryRole = role.toLowerCase();

        if (!validRoles.includes(queryRole)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        
        const user = await User.findByIdAndUpdate(req.params.id, { role: queryRole }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json({ message: `User role updated to ${role}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .populate('userId', 'name')
            .lean();

        const formattedLogs = logs.map(act => {
            const date = new Date(act.createdAt);
            const time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            
            return {
                id: act._id,
                admin: act.userId?.name || 'System',
                action: act.type || 'unknown_action',
                target: act.description || 'No description',
                time: time
            };
        });

        res.json(formattedLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    getLogs
};
