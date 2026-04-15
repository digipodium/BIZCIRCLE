const express = require('express');
const { signup, login, getUserProfile, updateUserProfile, updatePoints, uploadAvatar } = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', auth, getUserProfile);
router.get('/analytics', auth, require('../controllers/userController').getUserAnalytics);
router.put('/profile', auth, updateUserProfile);
router.post('/upload-avatar', auth, upload.single('file'), uploadAvatar);
router.put('/points', auth, updatePoints);

module.exports = router;