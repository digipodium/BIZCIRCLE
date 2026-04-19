const express = require('express');
const router = express.Router();
const Group = require('../models/groupModel');
const GroupMember = require('../models/groupMemberModel');
const Activity = require('../models/activityModel');
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

// Get All Groups (unchanged)
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().populate('createdBy', 'name email');
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

        res.json({ groups: dashboardGroups, requests });
    } catch (err) {
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

        const existingMember = await GroupMember.findOne({
            group: req.params.id,
            user: req.user.id
        });
        if (existingMember) return res.status(400).json({ message: 'Already requested or joined' });

        const status = group.isPrivate ? 'Pending' : 'Approved';
        const member = await GroupMember.create({
            group: req.params.id,
            user: req.user.id,
            role: 'Member',
            status
        });

        // Log activity only if directly approved (not pending approval)
        if (status === 'Approved') {
            await Activity.create({
                userId: req.user.id,
                type: 'circle_joined',
                targetId: group._id,
                targetModel: 'Group',
                description: `Joined group "${group.name}"`,
                meta: new Map([['groupName', group.name], ['category', group.category || '']]),
            });
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