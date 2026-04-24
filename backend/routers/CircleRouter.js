const express = require('express');
const router = express.Router();
const Circle = require('../models/circleModel');
const CircleMember = require('../models/circleMemberModel');
const Activity = require('../models/activityModel');
const User = require('../models/userModel');
const auth = require('../middleware/auth');
const { createNotification } = require('../controllers/notificationController');

// GET all circles (with optional domain and search filters)
router.get('/', async (req, res) => {
    try {
        const { domain, search } = req.query;
        let query = {};

        if (domain) {
            query = { $or: [{ domain }, { relatedDomains: domain }], status: 'Approved' };
        } else {
            query = { status: 'Approved' };
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const circles = await Circle.find(query).select('name domain location memberCount description relatedDomains color icon isPrivate status createdBy');

        // If user is authenticated, check which circles they are joined in
        let enrichedCircles = circles.map(c => c.toObject());
        const authHeader = req.headers.authorization;
        
        if (authHeader) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
                const userId = decoded.id;
                
                const memberships = await CircleMember.find({ user: userId, status: 'Approved' });
                const joinedIds = memberships.map(m => m.circle.toString());
                
                enrichedCircles = enrichedCircles.map(c => ({
                    ...c,
                    isJoined: joinedIds.includes(c._id.toString())
                }));
            } catch (err) {
                // Ignore auth error for public list
                console.warn("Auth check failed in GET /circles:", err.message);
            }
        }

        res.json(enrichedCircles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET mutual circles between current user and another user
router.get('/mutual/:otherUserId', auth, async (req, res) => {
    try {
        const [myMemberships, otherMemberships] = await Promise.all([
            CircleMember.find({ user: req.user.id, status: 'Approved' }),
            CircleMember.find({ user: req.params.otherUserId, status: 'Approved' }),
        ]);

        const myCircleIds = myMemberships.map(m => m.circle.toString());
        const otherCircleIds = otherMemberships.map(m => m.circle.toString());
        const mutualIds = myCircleIds.filter(id => otherCircleIds.includes(id));

        const mutualCircles = await Circle.find({ _id: { $in: mutualIds } })
            .select('name domain location memberCount color icon');

        res.json(mutualCircles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Admin Dashboard Data
router.get('/admin/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        let circleIds = [];
        
        if (user && user.role === 'admin') {
            // Platform Admins see all circles in their management view
            const allCircles = await Circle.find().select('_id');
            circleIds = allCircles.map(c => c._id);
        } else {
            // Circle Admins only see circles they manage
            const adminMemberships = await CircleMember.find({ user: req.user.id, role: 'Admin' });
            circleIds = adminMemberships.map(m => m.circle);
        }

        const circles = await Circle.find({ _id: { $in: circleIds } }).populate('createdBy', 'name').lean();

        const dashboardCircles = await Promise.all(circles.map(async (circle) => {
            const membersCount = await CircleMember.countDocuments({ circle: circle._id, status: 'Approved' });
            const pendingCount = await CircleMember.countDocuments({ circle: circle._id, status: 'Pending' });
            return {
                id: circle._id,
                name: circle.name,
                domain: circle.domain,
                location: circle.location || 'Global',
                members: membersCount,
                pending: pendingCount,
                color: circle.color || 'from-blue-500 to-blue-700',
                icon: circle.icon || '💻',
                creator: circle.createdBy?.name || 'Admin'
            };
        }));

        const pendingMemberships = await CircleMember.find({ 
            circle: { $in: circleIds },
            status: 'Pending'
        }).populate('user', 'name headline').populate('circle', 'name color').lean();

        const requests = pendingMemberships.map(reqData => {
            const name = reqData.user?.name || "Unknown";
            const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0,2);
            
            return {
                id: reqData._id,
                userName: name,
                avatar: initials,
                groupName: reqData.circle?.name || "Unknown",
                groupId: reqData.circle?._id,
                role: reqData.user?.headline || "Member",
                time: "Recently",
                avatarBg: reqData.circle?.color || "from-blue-400 to-blue-600",
            };
        });

        // PLATFORM ADMIN: Fetch circles pending platform approval
        let circleCreationRequests = [];
        if (user && user.role === 'admin') {
            const pendingCircles = await Circle.find({ status: 'Pending' }).populate('createdBy', 'name headline').lean();
            circleCreationRequests = pendingCircles.map(c => ({
                id: c._id,
                name: c.name,
                domain: c.domain,
                location: c.location,
                creatorName: c.createdBy?.name || "Unknown",
                creatorRole: c.createdBy?.headline || "Member",
                icon: c.icon || '💻',
                color: c.color || 'from-blue-500 to-blue-700',
            }));
        }

        res.json({ groups: dashboardCircles, requests, circleCreationRequests });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET my joined circles
router.get('/my', auth, async (req, res) => {
    try {
        const memberships = await CircleMember.find({ user: req.user.id, status: 'Approved' });
        const circleIds = memberships.map(m => m.circle);
        const circles = await Circle.find({ _id: { $in: circleIds } });
        res.json(circles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single circle by ID (With Membership check)
router.get('/:id', auth, async (req, res) => {
    try {
        const circle = await Circle.findById(req.params.id).populate('createdBy', 'name');
        if (!circle) return res.status(404).json({ error: 'Circle not found' });

        // Check membership
        const membership = await CircleMember.findOne({
            circle: req.params.id,
            user: req.user.id
        });

        const isJoined = membership?.status === 'Approved';
        const isPending = membership?.status === 'Pending';

        if (!isJoined) {
            // Return only public metadata for non-members
            return res.json({ 
                circle: {
                    _id: circle._id,
                    name: circle.name,
                    description: circle.description,
                    domain: circle.domain,
                    location: circle.location,
                    icon: circle.icon,
                    color: circle.color,
                    isPrivate: circle.isPrivate,
                    memberCount: circle.memberCount
                }, 
                isJoined: false,
                isPending
            });
        }

        // Full data for approved members
        const members = await CircleMember.find({
            circle: req.params.id,
            status: 'Approved'
        }).populate('user', 'name headline profilePicture');

        const isAdmin = membership?.role === 'Admin' || req.user.role === 'admin';

        let pendingRequests = [];
        if (isAdmin) {
            pendingRequests = await CircleMember.find({
                circle: req.params.id,
                status: 'Pending'
            }).populate('user', 'name headline profilePicture');
        }

        res.json({ circle, members, isJoined: true, isAdmin, pendingRequests });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a new circle
router.post('/', auth, async (req, res) => {
    try {
        const { name, domain, relatedDomains, location, description, icon, color, isPrivate, rules } = req.body;
        const circle = await Circle.create({
            name, domain, relatedDomains, location, description,
            icon, color, isPrivate, rules,
            createdBy: req.user.id,
            memberCount: 1,
            status: 'Pending', // ALWAYS Pending until approved by Platform Admin
        });

        // Add creator as Admin
        await CircleMember.create({
            circle: circle._id,
            user: req.user.id,
            role: 'Admin',
            status: 'Approved'
        });

        // Update user's circles array and primary domain if empty
        const userUpdate = { $push: { circles: circle._id } };
        const user = await User.findById(req.user.id);
        if (!user.primaryDomain && domain !== 'General') {
            userUpdate.primaryDomain = domain;
        }
        await User.findByIdAndUpdate(req.user.id, userUpdate);

        res.status(201).json(circle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST join a circle (Request Flow)
router.post('/join', auth, async (req, res) => {
    try {
        const { circleId } = req.body;
        const userId = req.user.id;

        const circle = await Circle.findById(circleId);
        if (!circle) return res.status(404).json({ error: 'Circle not found' });

        const [existingMember, user] = await Promise.all([
            CircleMember.findOne({ circle: circleId, user: userId }),
            User.findById(userId)
        ]);

        if (existingMember) return res.status(400).json({ error: 'Already requested or joined' });

        // Domain similarity check
        if (user.primaryDomain) {
            const userDomain = user.primaryDomain.toLowerCase();
            const allDomains = [circle.domain, ...(circle.relatedDomains || [])]
                .map(d => d.toLowerCase());
            const isSimilar = allDomains.some(d =>
                d.includes(userDomain.split(' ')[0]) ||
                userDomain.includes(d.split(' ')[0])
            );
            if (!isSimilar && circle.domain.toLowerCase() !== 'general') {
                return res.status(400).json({
                    error: `"${circle.name}" is not related to your primary domain (${user.primaryDomain}).`
                });
            }
        }

        const status = circle.isPrivate ? 'Pending' : 'Approved';
        const member = await CircleMember.create({
            circle: circleId,
            user: userId,
            role: 'Member',
            status
        });

        // Set primary domain if not already set
        if (!user.primaryDomain && circle.domain !== 'General') {
            await User.findByIdAndUpdate(userId, { primaryDomain: circle.domain });
        }

        const io = req.app.get('io');
        if (status === 'Approved') {
            await Promise.all([
                User.findByIdAndUpdate(userId, { $push: { circles: circleId } }),
                Circle.findByIdAndUpdate(circleId, { $inc: { memberCount: 1 } }),
                Activity.create({
                    userId,
                    type: 'circle_joined',
                    targetId: circleId,
                    targetModel: 'Circle',
                    description: `Joined ${circle.name}`,
                    meta: new Map([['circleName', circle.name]]),
                }),
                createNotification(io, {
                    userId,
                    category: 'connection',
                    type: 'connection_accepted',
                    message: `You have successfully joined "${circle.name}"!`,
                    priority: 'medium'
                })
            ]);
        } else if (status === 'Pending') {
            // Notify circle admin
            await createNotification(io, {
                userId: circle.createdBy,
                category: 'reminder',
                type: 'join_request',
                message: `${user.name} has requested to join your circle "${circle.name}".`,
                priority: 'medium'
            });
        }

        res.status(201).json({ success: true, status, member });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT Update circle settings (Admin only)
router.put('/:id', auth, async (req, res) => {
    try {
        const adminCheck = await CircleMember.findOne({
            circle: req.params.id,
            user: req.user.id,
            role: 'Admin'
        });
        
        if (!adminCheck && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can update circle settings' });
        }

        const updates = req.body;
        const circle = await Circle.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(circle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT manage member status (Admin only)
router.put('/:id/members/:memberId', auth, async (req, res) => {
    try {
        const adminCheck = await CircleMember.findOne({
            circle: req.params.id,
            user: req.user.id,
            role: 'Admin'
        });
        if (!adminCheck) return res.status(403).json({ message: 'Admins only' });

        const { status } = req.body; // 'Approved' or 'Banned'
        const member = await CircleMember.findByIdAndUpdate(
            req.params.memberId,
            { status },
            { new: true }
        ).populate('user', 'name');

        const circle = await Circle.findById(req.params.id);
        const io = req.app.get('io');

        if (status === 'Approved' && member?.user) {
            await Promise.all([
                User.findByIdAndUpdate(member.user._id, { $push: { circles: circle._id } }),
                Circle.findByIdAndUpdate(circle._id, { $inc: { memberCount: 1 } }),
                Activity.create({
                    userId: member.user._id,
                    type: 'circle_joined',
                    targetId: circle._id,
                    targetModel: 'Circle',
                    description: `Joined circle "${circle.name}"`,
                    meta: new Map([['circleName', circle.name]]),
                }),
                createNotification(io, {
                    userId: member.user._id,
                    category: 'connection',
                    type: 'connection_accepted',
                    message: `Your request to join "${circle.name}" has been approved!`,
                    priority: 'high',
                })
            ]);
        }

        res.json(member);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST leave a circle
router.post('/leave', auth, async (req, res) => {
    try {
        const { circleId } = req.body;
        const userId = req.user.id;

        const membership = await CircleMember.findOne({ circle: circleId, user: userId });
        if (!membership) return res.status(400).json({ error: 'You are not a member of this circle.' });

        await Promise.all([
            CircleMember.deleteOne({ _id: membership._id }),
            User.findByIdAndUpdate(userId, { $pull: { circles: circleId } }),
            Circle.findByIdAndUpdate(circleId, { $inc: { memberCount: -1 } }),
            Activity.create({
                userId,
                type: 'circle_left',
                targetId: circleId,
                targetModel: 'Circle',
                description: `Left circle`,
                meta: new Map([['circleId', circleId]]),
            }),
        ]);

        res.json({ success: true, message: `Left circle successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT approve/reject a circle (Super Admin Only)
router.put('/admin/review/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Platform Admin only.' });
        }

        const { status } = req.body; // 'Approved' or 'Rejected'
        const circle = await Circle.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!circle) return res.status(404).json({ error: 'Circle not found' });

        res.json({ message: `Circle ${status.toLowerCase()} successfully`, circle });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE a circle
router.delete('/:id', auth, async (req, res) => {
    try {
        const circleId = req.params.id;
        const userId = req.user.id;

        const circle = await Circle.findById(circleId);
        if (!circle) return res.status(404).json({ error: 'Circle not found' });

        // Check if user is the creator or a system admin
        const user = await User.findById(userId);
        const isCreator = circle.createdBy && circle.createdBy.toString() === userId;
        const isAdmin = user && user.role === 'admin';

        if (!isCreator && !isAdmin) {
            return res.status(403).json({ error: 'Not authorized to delete this circle' });
        }

        // Delete the circle
        await Circle.findByIdAndDelete(circleId);

        // Cleanup: Delete all memberships
        await CircleMember.deleteMany({ circle: circleId });

        // Cleanup: Pull circle from all users' circles array
        await User.updateMany({ circles: circleId }, { $pull: { circles: circleId } });

        // Cleanup: Delete related activities
        await Activity.deleteMany({ targetId: circleId, targetModel: 'Circle' });

        res.json({ success: true, message: 'Circle deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;