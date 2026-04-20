// backend/routers/SearchRouter.js
const express = require('express');
const { search, discoverUsers, discoverGroups } = require('../controllers/searchController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public search — no auth required
router.get('/search', search);

// Discovery — requires auth so we can personalise results
router.get('/discover/users',  auth, discoverUsers);
router.get('/discover/groups', auth, discoverGroups);

module.exports = router;
