const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const Poll = require('../models/pollModel');
const Notification = require('../models/notificationModel');
const auth = require('../middleware/auth');

// ==========================
// EVENTS
// ==========================
router.post('/events', auth, async (req, res) => {
    try {
        const { group, title, description, dateTime, meetingLink } = req.body;
        const newEvent = await Event.create({ group, title, description, dateTime, meetingLink });
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/events/:groupId', async (req, res) => {
    try {
        const events = await Event.find({ group: req.params.groupId }).sort({ dateTime: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/events/:eventId/rsvp', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const rsvpIndex = event.rsvp.findIndex(r => r.user.toString() === req.user.id);
        if (rsvpIndex > -1) {
            event.rsvp[rsvpIndex].status = status;
        } else {
            event.rsvp.push({ user: req.user.id, status });
        }
        
        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================
// POLLS
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
// NOTIFICATIONS
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
        const notif = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(notif);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
