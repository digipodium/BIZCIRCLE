const express = require('express');
const router = express.Router();
const Group = require('../models/groupModel');
const GroupMember = require('../models/groupMemberModel');
const Activity = require('../models/activityModel');  // NEW
const auth = require('../middleware/auth');

// Create Group (unchanged)
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, category, logo, rules, isPrivate } = req.body;

        const newGroup = await Group.create({
            name, description, category, logo, rules, isPrivate,
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

// Admin: Manage Member Status — UPDATED: logs activity when member is approved
router.put('/:id/members/:memberId', auth, async (req, res) => {
    try {
        // Verify requestor is admin
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

        // If admin just approved a pending request, log it as a join activity
        if (status === 'Approved' && member?.user) {
            const group = await Group.findById(req.params.id);
            await Activity.create({
                userId: member.user._id,
                type: 'circle_joined',
                targetId: group._id,
                targetModel: 'Group',
                description: `Joined group "${group.name}"`,
                meta: new Map([['groupName', group.name]]),
            });
        }

        res.json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;