const express = require('express');
const router = express.Router();
const Circle = require('../models/circleModel');
const User = require('../models/userModel');
const Activity = require('../models/activityModel');
const auth = require('../middleware/auth');

// GET all circles (with optional domain and search filters)
router.get('/', async (req, res) => {
    try {
        const { domain, search } = req.query;
        let query = {};

        if (domain) {
            query = { $or: [{ domain }, { relatedDomains: domain }] };
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const circles = await Circle.find(query).select('name domain location memberCount description relatedDomains');

        res.json(circles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET mutual circles between current user and another user
router.get('/mutual/:otherUserId', auth, async (req, res) => {
    try {
        const [me, other] = await Promise.all([
            User.findById(req.user.id).select('circles'),
            User.findById(req.params.otherUserId).select('circles'),
        ]);

        if (!other) return res.status(404).json({ error: 'User not found' });

        const myCircleIds = (me.circles || []).map(id => id.toString());
        const otherCircleIds = (other.circles || []).map(id => id.toString());
        const mutualIds = myCircleIds.filter(id => otherCircleIds.includes(id));

        const mutualCircles = await Circle.find({ _id: { $in: mutualIds } })
            .select('name domain location memberCount');

        res.json(mutualCircles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single circle by ID
router.get('/:id', async (req, res) => {
    try {
        const circle = await Circle.findById(req.params.id)
            .populate('members', 'name headline location')
            .populate('createdBy', 'name');
        if (!circle) return res.status(404).json({ error: 'Circle not found' });
        res.json(circle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a new circle
router.post('/', auth, async (req, res) => {
    try {
        const { name, domain, relatedDomains, location, description } = req.body;
        const circle = await Circle.create({
            name, domain, relatedDomains, location, description,
            createdBy: req.user.id,
            members: [req.user.id],
            memberCount: 1,
        });

        // Set primaryDomain on creator if not already set
        await User.findByIdAndUpdate(req.user.id, {
            $push: { circles: circle._id },
            $setOnInsert: { primaryDomain: domain },
        });

        res.status(201).json(circle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST join a circle
router.post('/join', auth, async (req, res) => {
    try {
        const { circleId } = req.body;
        const userId = req.user.id;

        const [user, circle] = await Promise.all([
            User.findById(userId).populate('circles'),
            Circle.findById(circleId),
        ]);

        if (!circle) return res.status(404).json({ error: 'Circle not found' });

        // Rule 1: max 3 circles - REMOVED per user request

        // Rule 2: domain similarity check
        if (user.primaryDomain) {
            const userDomain = user.primaryDomain.toLowerCase();
            const allDomains = [circle.domain, ...(circle.relatedDomains || [])]
                .map(d => d.toLowerCase());
            const isSimilar = allDomains.some(d =>
                d.includes(userDomain.split(' ')[0]) ||
                userDomain.includes(d.split(' ')[0])
            );
            if (!isSimilar) {
                return res.status(400).json({
                    error: `"${circle.domain}" is not related to your primary domain (${user.primaryDomain}).`
                });
            }
        }

        // Rule 3: already a member?
        if (user.circles.some(c => c._id.toString() === circleId)) {
            return res.status(400).json({ error: 'Already a member of this circle.' });
        }

        // Perform join
        const userUpdates = { $push: { circles: circleId } };
        if (!user.primaryDomain) userUpdates.primaryDomain = circle.domain;

        await Promise.all([
            User.findByIdAndUpdate(userId, userUpdates),
            Circle.findByIdAndUpdate(circleId, {
                $push: { members: userId },
                $inc: { memberCount: 1 },
            }),
            Activity.create({
                userId,
                type: 'circle_joined',
                targetId: circleId,
                targetModel: 'Circle',
                description: `Joined ${circle.name}`,
                meta: new Map([
                    ['circleName', circle.name],
                    ['domain', circle.domain],
                    ['location', circle.location],
                ]),
            }),
        ]);

        res.json({ success: true, message: `Joined ${circle.name}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST leave a circle
router.post('/leave', auth, async (req, res) => {
    try {
        const { circleId } = req.body;
        const userId = req.user.id;

        const circle = await Circle.findById(circleId);
        if (!circle) return res.status(404).json({ error: 'Circle not found' });

        // Check user is actually a member
        const user = await User.findById(userId);
        const isMember = user.circles.some(c => c.toString() === circleId);
        if (!isMember) return res.status(400).json({ error: 'You are not a member of this circle.' });

        await Promise.all([
            User.findByIdAndUpdate(userId, { $pull: { circles: circleId } }),
            Circle.findByIdAndUpdate(circleId, {
                $pull: { members: userId },
                $inc: { memberCount: -1 },
            }),
            Activity.create({
                userId,
                type: 'circle_left',
                targetId: circleId,
                targetModel: 'Circle',
                description: `Left ${circle.name}`,
                meta: new Map([['circleName', circle.name]]),
            }),
        ]);

        res.json({ success: true, message: `Left ${circle.name}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;