const express = require('express');
const router = express.Router();
const Group = require('../models/groupModel');
const GroupMember = require('../models/groupMemberModel');
const Activity = require('../models/activityModel');
const User = require('../models/userModel');
const auth = require('../middleware/auth');
const { createNotification } = require('../controllers/notificationController');

// Create Group (unchanged)
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, domain, location, icon, color, category, logo, rules } = req.body;
        // Default isPrivate to true if not provided, for dashboard join requests logic
        const isPrivate = req.body.isPrivate !== undefined ? req.body.isPrivate : true;

        const newGroup = await Group.create({
            name, description, domain, location, icon, color, category, logo, rules, isPrivate,
            createdBy: req.user.id
        });

        // Add creator as Admin
        await GroupMember.create({
            group: newGroup._id,
            user: req.user.id,
            role: 'Admin',
            status: 'Approved'
        });

        res.status(201).json(newGroup);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Groups (with search support)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const groups = await Group.find(query).populate('createdBy', 'name email');
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Dashboard Data
router.get('/admin/dashboard', auth, async (req, res) => {
    try {
        // 1. Find groups where user is admin
        const adminMemberships = await GroupMember.find({ user: req.user.id, role: 'Admin' });
        const groupIds = adminMemberships.map(m => m.group);

        // 2. Fetch the groups
        const groups = await Group.find({ _id: { $in: groupIds } }).lean();

        // 3. For each group, calculate stats
        const dashboardGroups = await Promise.all(groups.map(async (group) => {
            const membersCount = await GroupMember.countDocuments({ group: group._id, status: 'Approved' });
            const pendingCount = await GroupMember.countDocuments({ group: group._id, status: 'Pending' });
            return {
                id: group._id,
                name: group.name,
                domain: group.domain || group.category,
                location: group.location || 'Global',
                members: membersCount,
                pending: pendingCount,
                color: group.color || 'from-blue-500 to-blue-700',
                icon: group.icon || '💻',
            };
        }));

        // 4. Fetch all pending requests for these groups
        const pendingMemberships = await GroupMember.find({ 
            group: { $in: groupIds },
            status: 'Pending'
        }).populate('user', 'name headline').populate('group', 'name color').lean();

        const requests = pendingMemberships.map(req => {
            // Get initials
            const name = req.user?.name || "Unknown";
            const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2);
            
            // Format time ago naively
            const timeDiff = Math.floor((new Date() - new Date(req.createdAt)) / 60000); // mins
            let timeStr = `${timeDiff} mins ago`;
            if (timeDiff > 60) timeStr = `${Math.floor(timeDiff/60)} hours ago`;
            if (timeDiff > 1440) timeStr = `${Math.floor(timeDiff/1440)} days ago`;

            return {
                id: req._id,
                userName: name,
                avatar: initials,
                groupName: req.group?.name || "Unknown",
                groupId: req.group?._id,
                role: req.user?.headline || "Member",
                time: timeStr,
                avatarBg: req.group?.color || "from-blue-400 to-blue-600",
            };
        });

        // 5. Engagement Stats
        const totalPosts = await Activity.countDocuments({ targetId: { $in: groupIds }, type: 'post_created' });
        const totalReactions = await Activity.countDocuments({ targetId: { $in: groupIds }, type: 'endorsement_received' });
        const totalComments = 0; // Currently no comment tracking in Activity model
        // Mocking an engagement rate based on some arbitrary formula if posts > 0
        const engagementRate = totalPosts > 0 ? Math.min(100, Math.round(((totalReactions + totalComments) / totalPosts) * 10)) : 0;
        
        const engagementStats = {
            totalPosts,
            totalComments,
            totalReactions,
            engagementRate
        };

        // 6. Network Activities
        const recentActivities = await Activity.find({ targetId: { $in: groupIds } })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name')
            .lean();
            
        const activities = recentActivities.map(act => {
            let type = "📢"; 
            if (act.type === 'connection_accepted') type = "connection";
            else if (act.type === 'post_created') type = "post";
            else if (act.type === 'circle_joined') type = "milestone";
            else type = "milestone"; // fallback to milestone

            const timeDiff = Math.floor((new Date() - new Date(act.createdAt)) / 60000); 
            let timeStr = `${timeDiff} mins ago`;
            if (timeDiff > 60) timeStr = `${Math.floor(timeDiff/60)} hours ago`;
            if (timeDiff > 1440) timeStr = `${Math.floor(timeDiff/1440)} days ago`;

            return {
                id: act._id,
                type,
                text: act.description || `${act.userId?.name || 'Someone'} performed an action`,
                time: timeStr
            };
        });

        res.json({ groups: dashboardGroups, requests, engagementStats, activities });
    } catch (err) {
        console.error('Admin Dashboard Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get User's Joined Groups
router.get('/my', auth, async (req, res) => {
    try {
        // 1. Find the memberships
        const memberships = await GroupMember.find({ user: req.user.id, status: 'Approved' });
        const groupIds = memberships.map(m => m.group);
        
        // 2. Fetch the groups and populate any necessary info
        const groups = await Group.find({ _id: { $in: groupIds } }).populate('createdBy', 'name email');
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Mutual Groups with another user
router.get('/mutual/:otherUserId', auth, async (req, res) => {
    try {
        const myMemberships = await GroupMember.find({ user: req.user.id, status: 'Approved' });
        const otherMemberships = await GroupMember.find({ user: req.params.otherUserId, status: 'Approved' });
        
        const myGroupIds = myMemberships.map(m => m.group.toString());
        const otherGroupIds = otherMemberships.map(m => m.group.toString());
        
        const mutualGroupIds = myGroupIds.filter(id => otherGroupIds.includes(id));
        const mutualGroups = await Group.find({ _id: { $in: mutualGroupIds } }).populate('createdBy', 'name email');
        
        res.json(mutualGroups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Group By ID (unchanged)
router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('createdBy', 'name email');
        if (!group) return res.status(404).json({ message: 'Group not found' });

        const members = await GroupMember.find({
            group: req.params.id,
            status: 'Approved'
        }).populate('user', 'name');

        res.json({ group, members });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Join Group — UPDATED: added Activity.create() after successful join
router.post('/:id/join', auth, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        const [existingMember, user] = await Promise.all([
            GroupMember.findOne({ group: req.params.id, user: req.user.id }),
            User.findById(req.user.id)
        ]);

        if (existingMember) return res.status(400).json({ message: 'Already requested or joined' });

        // Domain similarity check
        if (user.primaryDomain) {
            const userDomain = user.primaryDomain.toLowerCase();
            const groupDomain = (group.domain || group.category || '').toLowerCase();
            const isSimilar = groupDomain.includes(userDomain.split(' ')[0]) ||
                             userDomain.includes(groupDomain.split(' ')[0]);
            
            if (!isSimilar && groupDomain !== 'general') {
                return res.status(400).json({ 
                    message: `"${group.name}" is in a different domain (${group.domain}). Circles/Groups must be in similar domains.` 
                });
            }
        }

        const status = group.isPrivate ? 'Pending' : 'Approved';
        const member = await GroupMember.create({
            group: req.params.id,
            user: req.user.id,
            role: 'Member',
            status
        });

        // Log activity only if directly approved (not pending approval)
        if (status === 'Approved') {
            await Promise.all([
                User.findByIdAndUpdate(req.user.id, {
                    $setOnInsert: { primaryDomain: group.domain || group.category }
                }),
                Activity.create({
                    userId: req.user.id,
                    type: 'circle_joined',
                    targetId: group._id,
                    targetModel: 'Group',
                    description: `Joined group "${group.name}"`,
                    meta: new Map([['groupName', group.name], ['category', group.category || '']]),
                })
            ]);
        }

        res.status(201).json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Manage Member Status — logs activity + fires notification on approval/ban
router.put('/:id/members/:memberId', auth, async (req, res) => {
    try {
        const adminCheck = await GroupMember.findOne({
            group: req.params.id,
            user: req.user.id,
            role: 'Admin'
        });
        if (!adminCheck) return res.status(403).json({ message: 'Admins only' });

        const { status } = req.body; // 'Approved' or 'Banned'
        const member = await GroupMember.findByIdAndUpdate(
            req.params.memberId,
            { status },
            { new: true }
        ).populate('user', 'name');

        const group = await Group.findById(req.params.id);
        const io = req.app.get('io');

        if (status === 'Approved' && member?.user) {
            // Activity log
            await Activity.create({
                userId: member.user._id,
                type: 'circle_joined',
                targetId: group._id,
                targetModel: 'Group',
                description: `Joined group "${group.name}"`,
                meta: new Map([['groupName', group.name]]),
            });
            // Notification to the user whose request was approved
            await createNotification(io, {
                userId: member.user._id,
                category: 'connection',
                type: 'connection_accepted',
                message: `Your request to join "${group.name}" has been approved! Welcome aboard.`,
                priority: 'high',
            });
        }

        if (status === 'Banned' && member?.user) {
            await createNotification(io, {
                userId: member.user._id,
                category: 'announcement',
                type: 'system_alert',
                message: `You have been removed from the group "${group.name}".`,
                priority: 'high',
            });
        }

        res.json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;