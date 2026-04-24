const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const CircleMember = require('../models/circleMemberModel');
const auth = require('../middleware/auth');

// Get events for a group/circle
router.get('/:targetId', auth, async (req, res) => {
    try {
        const events = await Event.find({ targetId: req.params.targetId })
            .sort({ dateTime: 1 })
            .populate('createdBy', 'name email')
            .populate('rsvp.user', 'name');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create event
router.post('/', auth, async (req, res) => {
    try {
        const { targetId, targetModel, title, description, dateTime, meetingLink } = req.body;
        
        // Authorization check for Circles
        if (targetModel === 'Circle') {
            const adminCheck = await CircleMember.findOne({
                circle: targetId,
                user: req.user.id,
                role: 'Admin',
                status: 'Approved'
            });

            if (!adminCheck && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Only circle admins can schedule meetings' });
            }
        }
        
        const newEvent = await Event.create({
            targetId,
            targetModel,
            title,
            description,
            dateTime,
            meetingLink,
            createdBy: req.user.id,
            rsvp: [{ user: req.user.id, status: 'Attending' }]
        });
        
        const populatedEvent = await Event.findById(newEvent._id).populate('createdBy', 'name email').populate('rsvp.user', 'name');
        res.status(201).json(populatedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update event
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, dateTime, meetingLink } = req.body;
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { title, description, dateTime, meetingLink },
            { new: true }
        ).populate('createdBy', 'name email').populate('rsvp.user', 'name');
        
        if (!event) return res.status(404).json({ message: 'Event not found or unauthorized' });
        
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!event) return res.status(404).json({ message: 'Event not found or unauthorized' });
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// RSVP to an event
router.post('/:id/rsvp', auth, async (req, res) => {
    try {
        const { status } = req.body; // 'Attending', 'Maybe', 'Not Attending'
        const event = await Event.findById(req.params.id);
        
        if (!event) return res.status(404).json({ message: 'Event not found' });
        
        // Remove existing RSVP if any
        event.rsvp = event.rsvp.filter(r => r.user.toString() !== req.user.id);
        
        // Add new RSVP if not 'Not Attending', or keep it depending on schema (schema has 'Not Attending' enum)
        if (status) {
            event.rsvp.push({ user: req.user.id, status });
        }
        
        await event.save();
        const updatedEvent = await Event.findById(req.params.id).populate('createdBy', 'name email').populate('rsvp.user', 'name');
        
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
