const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const Poll = require('../models/pollModel');
const Notification = require('../models/notificationModel');
const Activity = require('../models/activityModel');
const GroupMember = require('../models/groupMemberModel');
const Circle = require('../models/circleModel');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
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
            .populate({ path: 'targetId', strictPopulate: false });  // works for Circle, User, Group via refPath

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
        console.error('Activity Feed Error:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
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



module.exports = router;