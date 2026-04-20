const express = require('express');
const {
    signup,
    login,
    googleLogin,
    getUserProfile,
    updateUserProfile,
    updatePoints,
    uploadAvatar,
    getUserAnalytics,
    getAllUsers,
    connectUser,
    getPublicProfile
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/profile', auth, getUserProfile);
router.get('/analytics', auth, getUserAnalytics);
router.get('/all', auth, getAllUsers);
router.put('/profile', auth, updateUserProfile);
router.post('/upload-avatar', auth, upload.single('file'), uploadAvatar);
router.put('/points', auth, updatePoints);
router.post('/connect/:id', auth, connectUser);
router.get('/:id', auth, getPublicProfile);

module.exports = router;
