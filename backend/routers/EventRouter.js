const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const CircleMember = require('../models/circleMemberModel');
const GroupMember = require('../models/groupMemberModel');
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

// Helper function to check if user is admin of the target
async function checkAdmin(userId, userRole, targetId, targetModel) {
    if (userRole === 'admin') return true;

    if (targetModel === 'Circle') {
        const adminCheck = await CircleMember.findOne({
            circle: targetId,
            user: userId,
            role: 'Admin',
            status: 'Approved'
        });
        return !!adminCheck;
    } else if (targetModel === 'Group') {
        const adminCheck = await GroupMember.findOne({
            group: targetId,
            user: userId,
            role: 'Admin',
            status: 'Approved'
        });
        return !!adminCheck;
    }
    return false;
}

// Create event
router.post('/', auth, async (req, res) => {
    try {
        const { targetId, targetModel, title, description, dateTime, meetingLink } = req.body;
        
        const isAdmin = await checkAdmin(req.user.id, req.user.role, targetId, targetModel);

        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admins can schedule meetings' });
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
        const event = await Event.findById(req.params.id);
        
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const isAdmin = await checkAdmin(req.user.id, req.user.role, event.targetId, event.targetModel);
        const isCreator = event.createdBy.toString() === req.user.id;

        if (!isAdmin && !isCreator) {
            return res.status(403).json({ message: 'Unauthorized to update this event' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, dateTime, meetingLink },
            { new: true }
        ).populate('createdBy', 'name email').populate('rsvp.user', 'name');
        
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const isAdmin = await checkAdmin(req.user.id, req.user.role, event.targetId, event.targetModel);
        const isCreator = event.createdBy.toString() === req.user.id;

        if (!isAdmin && !isCreator) {
            return res.status(403).json({ message: 'Unauthorized to delete this event' });
        }

        await Event.findByIdAndDelete(req.params.id);
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
        
        // Add new RSVP
        if (status && status !== 'Not Attending') {
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
