const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Fetch messages for a group
router.get('/:groupId', async (req, res) => {
    try {
        const messages = await Message.find({ group: req.params.groupId })
                                      .populate('sender', 'name email')
                                      .sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload a file and get URL back (to be used in socket or direct message post)
router.post('/upload', auth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ fileUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
