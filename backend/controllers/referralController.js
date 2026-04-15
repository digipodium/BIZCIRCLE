const Referral = require('../models/referralModel');
const User = require('../models/userModel');
const Activity = require('../models/activityModel');

const createReferral = async (req, res) => {
    try {
        const { candidateName, candidateEmail, targetCircle, role, message, receiverId } = req.body;
        const senderId = req.user.id;

        // 1. Create the referral record
        const referral = await Referral.create({
            sender: senderId,
            receiver: receiverId || null,
            candidateName,
            candidateEmail,
            targetCircle: targetCircle || null,
            role,
            message,
            status: 'Pending'
        });

        // 2. Award BizPoints to sender (+30)
        await User.findByIdAndUpdate(senderId, {
            $inc: { points: 30, referralsGiven: 1 }
        });

        // 3. Log Activity for Sender
        await Activity.create({
            userId: senderId,
            type: 'referral_sent',
            targetId: referral._id,
            targetModel: 'User', // Referencing the candidate in context
            description: `Sent a referral for ${candidateName}`,
            meta: new Map([
                ['candidateName', candidateName],
                ['role', role || ''],
                ['pointsAwarded', '30']
            ])
        });

        // 4. Log Activity for Receiver (if internal)
        if (receiverId) {
            await Activity.create({
                userId: receiverId,
                type: 'referral_received',
                targetId: referral._id,
                targetModel: 'User',
                description: `Received a referral from ${req.user.name || 'a connection'}`,
                meta: new Map([
                    ['senderName', req.user.name || 'Anonymous'],
                    ['candidateName', candidateName]
                ])
            });
        }

        res.status(201).json(referral);
    } catch (err) {
        console.error('Create referral error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMySentReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find({ sender: req.user.id })
            .populate('receiver', 'name email')
            .populate('targetCircle', 'name domain')
            .sort({ createdAt: -1 });
        res.json(referrals);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyReceivedReferrals = async (req, res) => {
    try {
        const referrals = await Referral.find({ receiver: req.user.id })
            .populate('sender', 'name email')
            .populate('targetCircle', 'name domain')
            .sort({ createdAt: -1 });
        res.json(referrals);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateReferralStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const referral = await Referral.findById(req.params.id);

        if (!referral) return res.status(404).json({ message: 'Referral not found' });
        
        // Only the intended receiver (if internal) or an admin can update
        // If it was a general referral (no receiverId), maybe the circle admin?
        // For simplicity, let's allow the receiver to update if it was sent to them.
        if (referral.receiver && referral.receiver.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this referral' });
        }

        const oldStatus = referral.status;
        referral.status = status;
        await referral.save();

        if (status === 'Successful' && oldStatus !== 'Successful') {
            // Reward sender (+30)
            await User.findByIdAndUpdate(referral.sender, {
                $inc: { points: 30 }
            });

            // Log Success Activity
            await Activity.create({
                userId: referral.sender,
                type: 'referral_received', // Using this type or a new one
                targetId: referral._id,
                targetModel: 'User',
                description: `Referral for ${referral.candidateName} was successful!`,
                meta: new Map([['status', 'Successful'], ['pointsAwarded', '30']])
            });
        }

        res.json(referral);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createReferral, getMySentReferrals, getMyReceivedReferrals, updateReferralStatus };
