const express = require('express');
const { signup, login, getUserProfile, updateUserProfile, updatePoints, uploadAvatar, getPublicProfile, connectUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.post('/upload-avatar', auth, upload.single('file'), uploadAvatar);
router.put('/points', auth, updatePoints);
router.post('/connect/:id', auth, connectUser);
router.get('/:id', auth, getPublicProfile);

module.exports = router;