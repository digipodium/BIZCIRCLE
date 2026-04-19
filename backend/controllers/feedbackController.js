const Feedback = require('../models/feedbackModel');
const User = require('../models/userModel');
const { createNotification } = require('./notificationController');
const { hasBannedWords, moderateUser } = require('../utils/moderation');

// Submit new feedback/report/bug
const submitFeedback = async (req, res) => {
    try {
        const { category, type, message, title, stepsToReproduce, severity, rating, reportedUser, reportedUrl } = req.body;
        
        // 1. Content Moderation: Check for banned words in message/title
        if (hasBannedWords(message) || hasBannedWords(title)) {
            const { warning, blocked } = await moderateUser(req.user.id);
            if (blocked) {
                return res.status(403).json({ 
                    success: false, 
                    message: "Your account has been blocked due to repeated policy violations.",
                    blocked: true
                });
            }
            if (warning) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Inappropriate content detected. This is a warning. Continued violations will lead to a block.",
                    warning: true
                });
            }
        }

        const newFeedback = await Feedback.create({
            userId: req.user.id,
            category,
            type,
            title,
            message,
            stepsToReproduce,
            severity,
            rating,
            reportedUser,
            reportedUrl
        });

        // 2. Auto Moderation: Check report count for reportedUser
        if (category === 'report' && reportedUser) {
            const reportCount = await Feedback.countDocuments({ reportedUser, category: 'report' });
            if (reportCount >= 3) {
                await User.findByIdAndUpdate(reportedUser, { isBlocked: true });
                // Notify user they are blocked (optional but requested)
                try {
                    const io = req.app.get('io');
                    if (io) {
                        await createNotification(io, {
                            userId: reportedUser,
                            category: 'announcement',
                            type: 'system_alert',
                            message: "Your account has been blocked due to multiple community reports.",
                            priority: 'high'
                        });
                    }
                } catch (e) {}
            }
        }

        // Notify admins asynchronously
        try {
            const io = req.app.get('io');
            if (io) {
                // Find all admin users using lean() to get plain JS objects
                const admins = await User.find({ role: 'admin' }).select('_id').lean();
                
                // If no admins are set up, we just log it and continue
                if (admins.length > 0) {
                    for (const admin of admins) {
                        await createNotification(io, {
                            userId: admin._id,
                            category: 'announcement',  
                            type: 'system_alert',
                            message: `New ${category} submitted: ${type}`,
                            priority: 'high'
                        });
                    }
                }
            }
        } catch (notifErr) {
            console.error("Failed to notify admins:", notifErr);
        }

        res.status(201).json({ success: true, feedback: newFeedback });
    } catch (err) {
        console.error("Error submitting feedback:", err);
        res.status(500).json({ error: err.message });
    }
};

// Retrieve user's own feedback tracking
const getMyFeedback = async (req, res) => {
    try {
        const myFeedback = await Feedback.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, data: myFeedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Retrieve all feedback (Admin view)
// Includes populated user details for dashboard visibility
const getAllFeedback = async (req, res) => {
    try {
        // Simple security check (ideally managed by middlewware, but double checking here)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }

        const allFeedback = await Feedback.find()
            .populate('userId', 'name email profilePicture')
            .populate('reportedUser', 'name email')
            .sort({ createdAt: -1 });
            
        res.json({ success: true, data: allFeedback });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin updates status of feedback (pending -> in-progress -> resolved)
const updateFeedbackStatus = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }

        const { id } = req.params;
        const { status } = req.body;

        const updated = await Feedback.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        // Notify user if ticket moves to resolved/in-progress
        try {
            const io = req.app.get('io');
            if (io && (status === 'resolved' || status === 'in-progress')) {
                let msg = status === 'resolved' 
                    ? `Your recent ${updated.category} ticket has been marked as Resolved.` 
                    : `Your ${updated.category} ticket is currently under review.`;
                
                // Let's use priority appropriately
                await createNotification(io, {
                    userId: updated.userId,
                    category: 'opportunity', // Just leveraging an existing category with a nice color
                    type: 'system_alert',
                    message: msg,
                    priority: status === 'resolved' ? 'high' : 'medium'
                });
            }
        } catch (notifErr) {
            console.error("User notify failed:", notifErr);
        }

        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin moderation actions: block user or ignore report
const moderateAction = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }

        const { id } = req.params; // Feedback ID
        const { action } = req.body; // 'block' or 'ignore'

        const feedback = await Feedback.findById(id).populate('reportedUser userId');
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        if (action === 'block') {
            // Block the reported user (if any) or the reporter (if they submitted bad content)
            const targetUserId = feedback.reportedUser?._id || feedback.userId?._id;
            await User.findByIdAndUpdate(targetUserId, { isBlocked: true });
            
            // Mark feedback as resolved/processed
            feedback.status = 'resolved';
            await feedback.save();

            // Notify target user
            const io = req.app.get('io');
            if (io) {
                await createNotification(io, {
                    userId: targetUserId,
                    category: 'announcement',
                    type: 'system_alert',
                    message: "Your account has been blocked by an administrator for policy violations.",
                    priority: 'high'
                });
            }

            return res.json({ success: true, message: "User blocked successfully" });
        }

        if (action === 'ignore') {
            feedback.status = 'rejected';
            await feedback.save();
            return res.json({ success: true, message: "Report ignored" });
        }

        res.status(400).json({ message: "Invalid action" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    submitFeedback,
    getMyFeedback,
    getAllFeedback,
    updateFeedbackStatus,
    moderateAction
};
