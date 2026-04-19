const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    submitFeedback,
    getMyFeedback,
    getAllFeedback,
    updateFeedbackStatus,
    moderateAction
} = require('../controllers/feedbackController');

// All feedback endpoints require auth
router.post('/', auth, submitFeedback);
router.get('/my', auth, getMyFeedback);
router.get('/all', auth, getAllFeedback); // Admin explicitly checked in controller
router.patch('/:id/status', auth, updateFeedbackStatus);
router.post('/:id/moderate', auth, moderateAction);

module.exports = router;
