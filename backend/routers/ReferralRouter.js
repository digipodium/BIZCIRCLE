const express = require('express');
const { createReferral, getMySentReferrals, getMyReceivedReferrals } = require('../controllers/referralController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createReferral);
router.get('/sent', auth, getMySentReferrals);
router.get('/received', auth, getMyReceivedReferrals);
router.put('/:id/status', auth, require('../controllers/referralController').updateReferralStatus);

module.exports = router;
