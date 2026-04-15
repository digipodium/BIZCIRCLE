const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const Poll = require('../models/pollModel');
const Notification = require('../models/notificationModel');
const Activity = require('../models/activityModel');  // NEW
const GroupMember = require('../models/groupMemberModel');
const auth = require('../middleware/auth');

// ==========================
// ACTIVITY FEED (NEW)
// ==========================

// GET /activity/feed — logged-in user's activity feed
router.get('/feed', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const feed = await Activity.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('targetId');  // works for Circle, User, Group via refPath

        const total = await Activity.countDocuments({ userId: req.user.id });

        res.json({
            feed,
            pagination: {
                page,
                limit,
                total,
                hasMore: skip + feed.length < total,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/my-meetings — upcoming meetings for all joined circles/groups
router.get('/my-meetings', auth, async (req, res) => {
    try {
        const user = await require('../models/userModel').findById(req.user.id);
        const joinedCircleIds = user.circles || [];
        
        const memberships = await GroupMember.find({ user: req.user.id, status: 'Approved' });
        const joinedGroupIds = memberships.map(m => m.group);

        const allJoinedIds = [...joinedCircleIds, ...joinedGroupIds];

        const meetings = await Event.find({
            targetId: { $in: allJoinedIds },
            dateTime: { $gte: new Date() } // Future meetings only
        })
        .populate('targetId', 'name icon color')
        .sort({ dateTime: 1 })
        .limit(10);

        res.json(meetings);
    } catch (err) {
        console.error('My meetings error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================
// EVENTS (unchanged)
// ==========================

router.post('/events', auth, async (req, res) => {
    try {
        const { targetId, targetModel, title, description, dateTime, meetingLink } = req.body;
        const newEvent = await Event.create({ 
            targetId, 
            targetModel: targetModel || 'Group',
            title, 
            description, 
            dateTime, 
            meetingLink,
            createdBy: req.user.id 
        });
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/events/:targetId', async (req, res) => {
    try {
        const events = await Event.find({ targetId: req.params.targetId }).sort({ dateTime: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Event
router.put('/events/:eventId', auth, async (req, res) => {
    try {
        const { title, description, dateTime, meetingLink } = req.body;
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if user is admin of the group
        const adminCheck = await GroupMember.findOne({
            group: event.group,
            user: req.user.id,
            role: 'Admin'
        });
        if (!adminCheck) return res.status(403).json({ message: 'Only group admins can edit events' });

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            { title, description, dateTime, meetingLink },
            { new: true }
        );
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Event
router.delete('/events/:eventId', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Check if user is admin of the group
        const adminCheck = await GroupMember.findOne({
            group: event.group,
            user: req.user.id,
            role: 'Admin'
        });
        if (!adminCheck) return res.status(403).json({ message: 'Only group admins can delete events' });

        await Event.findByIdAndDelete(req.params.eventId);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/events/:eventId/rsvp', auth, async (req, res) => {
    try {
        const { status } = req.body; // 'Attending' or 'Not Attending'
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const rsvpIndex = event.rsvp.findIndex(r => r.user.toString() === req.user.id);
        
        if (rsvpIndex > -1) {
            // If already attending and status is 'Not Attending', or if toggle is desired
            if (status === 'Not Attending') {
                event.rsvp.splice(rsvpIndex, 1);
            } else {
                event.rsvp[rsvpIndex].status = status;
            }
        } else if (status === 'Attending') {
            event.rsvp.push({ user: req.user.id, status });
        }

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================
// POLLS (unchanged)
// ==========================

router.post('/polls', auth, async (req, res) => {
    try {
        const { group, question, options } = req.body;
        const formattedOptions = options.map(opt => ({ text: opt, votes: [] }));
        const newPoll = await Poll.create({
            group, question, options: formattedOptions, createdBy: req.user.id
        });
        res.status(201).json(newPoll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/polls/:groupId', async (req, res) => {
    try {
        const polls = await Poll.find({ group: req.params.groupId }).populate('createdBy', 'name');
        res.json(polls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/polls/:pollId/vote', auth, async (req, res) => {
    try {
        const { optionId } = req.body;
        const poll = await Poll.findById(req.params.pollId);
        if (!poll) return res.status(404).json({ message: 'Poll not found' });

        // Remove old vote first if exists
        poll.options.forEach(opt => {
            opt.votes = opt.votes.filter(vId => vId.toString() !== req.user.id);
        });

        // Add new vote
        const option = poll.options.id(optionId);
        if (option) {
            option.votes.push(req.user.id);
        }

        await poll.save();
        res.json(poll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================
// NOTIFICATIONS (unchanged)
// ==========================

router.get('/notifications', auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/notifications/:id/read', auth, async (req, res) => {
    try {
        const notif = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.json(notif);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;