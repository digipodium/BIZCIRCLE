const Referral = require('../models/referralModel');
const User = require('../models/userModel');
const Activity = require('../models/activityModel');
const Notification = require('../models/notificationModel');
const crypto = require('crypto');
const { sendVerificationEmail, sendReferralReceivedEmail } = require('../utils/mailer');

const createReferral = async (req, res) => {
    try {
        const { candidateName, candidateEmail, targetCircle, role, message, receiverId } = req.body;
        const senderId = req.user.id;
        const senderName = req.user.name;

        // Check if user has joined any circles
        const sender = await User.findById(senderId).select('circles');
        if (!sender.circles || sender.circles.length === 0) {
            return res.status(403).json({ 
                message: 'You must join at least one circle to share referrals.' 
            });
        }

        // Generate verification token (32 chars)
        const verificationToken = crypto.randomBytes(16).toString('hex');
        // Expiry: 30 days from now
        const verificationTokenExpiry = new Date();
        verificationTokenExpiry.setDate(verificationTokenExpiry.getDate() + 30);

        // 1. Create the referral record
        const referral = await Referral.create({
            sender: senderId,
            receiver: receiverId || null,
            candidateName,
            candidateEmail,
            targetCircle: targetCircle || null,
            role,
            message,
            status: 'Pending',
            verificationToken,
            verificationTokenExpiry
        });

        // 2. Send Notifications
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        // Email to Candidate (Verification)
        const verificationLink = `${frontendUrl}/verify-referral?token=${verificationToken}`;
        await sendVerificationEmail({
            to: candidateEmail,
            candidateName,
            senderName,
            verificationLink
        });

        // Notification and Email to Receiver if internal
        if (receiverId) {
            try {
                const receiverUser = await User.findById(receiverId).select('name email');
                if (receiverUser) {
                    // Create in-app notification
                    await Notification.create({
                        recipient: receiverUser._id,
                        sender: senderId,
                        category: 'referral',
                        type: 'referral_received',
                        message: `${senderName} has sent you a new referral for ${candidateName}.`,
                        priority: 'high',
                        linkTo: '/dashboard/referrals',
                        meta: new Map([
                            ['candidateName', candidateName],
                            ['senderName', senderName]
                        ])
                    });

                    // Send email notification
                    if (receiverUser.email) {
                        await sendReferralReceivedEmail({
                            to: receiverUser.email,
                            receiverName: receiverUser.name,
                            senderName,
                            candidateName
                        });
                    }
                }
            } catch (notifErr) {
                console.error('Failed to send receiver notification/email:', notifErr);
                // Non-fatal error for the request
            }
        }

        // 3. Log Activity for Sender (Submission)
        await Activity.create({
            userId: senderId,
            type: 'referral_sent',
            targetId: referral._id,
            targetModel: 'User',
            description: `Sent a referral for ${candidateName} (Pending verification)`,
            meta: new Map([
                ['candidateName', candidateName],
                ['role', role || ''],
            ])
        });

        res.status(201).json(referral);
    } catch (err) {
        console.error('Create referral error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyReferral = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Verification token is required' });
        }

        const referral = await Referral.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: new Date() }
        }).populate('sender', 'name');

        if (!referral) {
            return res.status(404).json({ message: 'Invalid or expired verification link' });
        }

        if (referral.status !== 'Pending') {
            return res.status(400).json({ message: 'Referral is already verified or processed' });
        }

        // Update referral
        referral.status = 'Verified';
        referral.verifiedAt = new Date();
        referral.verificationToken = undefined; // Clear token after use
        referral.verificationTokenExpiry = undefined;
        await referral.save();

        // Award BizPoints to sender (+30) for successful verification
        await User.findByIdAndUpdate(referral.sender._id, {
            $inc: { points: 30, referralsGiven: 1 }
        });

        // Log Verification Activity for Sender
        await Activity.create({
            userId: referral.sender._id,
            type: 'referral_received', // Status update type
            targetId: referral._id,
            targetModel: 'User',
            description: `Referral for ${referral.candidateName} has been verified by the candidate!`,
            meta: new Map([
                ['candidateName', referral.candidateName],
                ['pointsAwarded', '30']
            ])
        });

        res.json({ message: 'Referral verified successfully', referral });
    } catch (err) {
        console.error('Verify referral error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const resendVerification = async (req, res) => {
    try {
        const referral = await Referral.findById(req.params.id);
        if (!referral) return res.status(404).json({ message: 'Referral not found' });

        if (referral.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (referral.status !== 'Pending') {
            return res.status(400).json({ message: 'Referral is already verified' });
        }

        // Generate new token
        const newToken = crypto.randomBytes(16).toString('hex');
        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 30);

        referral.verificationToken = newToken;
        referral.verificationTokenExpiry = newExpiry;
        await referral.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const verificationLink = `${frontendUrl}/verify-referral?token=${newToken}`;

        await sendVerificationEmail({
            to: referral.candidateEmail,
            candidateName: referral.candidateName,
            senderName: req.user.name,
            verificationLink
        });

        res.json({ message: 'Verification email resent' });
    } catch (err) {
        console.error('Resend verification error:', err);
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
        
        if (referral.receiver && referral.receiver.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this referral' });
        }

        if (referral.status === 'Pending') {
            return res.status(400).json({ message: 'Referral must be verified by candidate first' });
        }

        referral.status = status;
        await referral.save();

        if (status === 'Successful') {
            // Bonus points for final success (+15 to both)
            await User.findByIdAndUpdate(referral.sender, { $inc: { points: 15 } });
            await User.findByIdAndUpdate(req.user.id, { $inc: { points: 15 } });

            await Activity.create({
                userId: referral.sender,
                type: 'referral_received',
                targetId: referral._id,
                targetModel: 'User',
                description: `Referral for ${referral.candidateName} completed successfully!`,
                meta: new Map([['status', 'Successful'], ['pointsAwarded', '15']])
            });
        }

        res.json(referral);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { 
    createReferral, 
    verifyReferral, 
    resendVerification, 
    getMySentReferrals, 
    getMyReceivedReferrals, 
    updateReferralStatus 
};
