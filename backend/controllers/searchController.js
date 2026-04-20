// backend/controllers/searchController.js
const User = require('../models/userModel');
const Group = require('../models/groupModel');

// ─── GET /api/search?q=keyword ────────────────────────────────────────────────
const search = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();

    if (!q) {
      return res.json({ users: [], groups: [] });
    }

    const regex = { $regex: q, $options: 'i' };

    // Search users by name OR skills
    const users = await User.find({
      $or: [
        { name: regex },
        { skills: regex },
        { headline: regex },
        { organization: regex },
      ],
    })
      .select('name email skills headline organization profilePicture role')
      .limit(10);

    // Search groups by name OR description
    const groups = await Group.find({
      $or: [
        { name: regex },
        { description: regex },
        { domain: regex },
        { category: regex },
      ],
    })
      .select('name description domain category icon color logo location')
      .limit(10);

    return res.json({ users, groups });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

// ─── GET /api/discover/users ──────────────────────────────────────────────────
const discoverUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Fetch the authenticated user's data
    const currentUser = await User.findById(currentUserId).select('skills connections');

    const excludeIds = [
      currentUserId,
      ...(currentUser?.connections || []),
    ];

    let suggestions = [];

    // 1) Try skill-based matching first
    if (currentUser?.skills?.length > 0) {
      suggestions = await User.find({
        _id: { $nin: excludeIds },
        skills: { $in: currentUser.skills },
      })
        .select('name email skills headline organization profilePicture role')
        .limit(8);
    }

    // 2) Fall back to random users if fewer than 5 skill matches
    if (suggestions.length < 5) {
      const alreadyFound = suggestions.map(u => u._id.toString());
      const fallback = await User.find({
        _id: { $nin: [...excludeIds, ...alreadyFound] },
      })
        .select('name email skills headline organization profilePicture role')
        .limit(8 - suggestions.length);

      suggestions = [...suggestions, ...fallback];
    }

    return res.json(suggestions);
  } catch (err) {
    console.error('Discover users error:', err);
    return res.status(500).json({ message: 'Discovery failed', error: err.message });
  }
};

// ─── GET /api/discover/groups ─────────────────────────────────────────────────
const discoverGroups = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = await User.findById(currentUserId).select('skills circles primaryDomain');

    const joinedGroupIds = currentUser?.circles || [];

    let suggestions = [];

    // 1) Try to match groups by user skills / primaryDomain
    if (currentUser?.skills?.length > 0 || currentUser?.primaryDomain) {
      const skillRegexes = (currentUser.skills || []).map(s => new RegExp(s, 'i'));
      const domainRegex = currentUser.primaryDomain
        ? new RegExp(currentUser.primaryDomain, 'i')
        : null;

      const orConditions = skillRegexes.map(r => ({ domain: r }));
      if (domainRegex) orConditions.push({ domain: domainRegex });
      // also match category
      skillRegexes.forEach(r => orConditions.push({ category: r }));

      if (orConditions.length > 0) {
        suggestions = await Group.find({
          _id: { $nin: joinedGroupIds },
          $or: orConditions,
        })
          .select('name description domain category icon color logo location')
          .limit(8);
      }
    }

    // 2) Fall back to random groups
    if (suggestions.length < 5) {
      const alreadyFound = suggestions.map(g => g._id.toString());
      const fallback = await Group.find({
        _id: { $nin: [...joinedGroupIds, ...alreadyFound] },
      })
        .select('name description domain category icon color logo location')
        .limit(8 - suggestions.length);

      suggestions = [...suggestions, ...fallback];
    }

    return res.json(suggestions);
  } catch (err) {
    console.error('Discover groups error:', err);
    return res.status(500).json({ message: 'Discovery failed', error: err.message });
  }
};

module.exports = { search, discoverUsers, discoverGroups };
