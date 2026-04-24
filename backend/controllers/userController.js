const User = require('../models/userModel');
const GroupMember = require('../models/groupMemberModel');
const Group = require('../models/groupModel');
const Activity = require('../models/activityModel');
const mongoose = require('mongoose');
const Circle = require('../models/circleModel');
const CircleMember = require('../models/circleMemberModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createNotification } = require('./notificationController');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const JWT_SECRET = process.env.JWT_SECRET || 'mytopseret';

// POST /user/signup
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, category } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = `${firstName} ${lastName}`;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      category: category || 'Other',
      points: 50, // Initial points for profile creation/completion
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /user/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /user/google-login
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'ID Token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
        role: 'user',
        category: 'Professional',
        points: 50,
      });
    } else if (!user.googleId) {
      // Link Google ID to existing email account
      user.googleId = googleId;
      if (!user.profilePicture) user.profilePicture = picture;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};


// GET /user/profile  (requires auth middleware)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('circles', 'name domain location members createdBy');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch joined circles from the CircleMember system
    const memberships = await CircleMember.find({ user: req.user.id, status: 'Approved' })
      .populate('circle', 'name domain location description icon color createdBy');

    const joinedGroups = memberships
      .filter(m => m.circle !== null)
      .map(m => ({
        ...m.circle.toObject(),
        membershipRole: m.role
      }));

    // Check if user is an admin of ANY circle
    const adminCheck = memberships.some(m => m.role === 'Admin');
    const isCircleAdmin = adminCheck || user.role === 'admin';

    res.json({ ...user.toObject(), joinedGroups, isCircleAdmin });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// PUT /user/profile  (requires auth middleware)
const updateUserProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'bio', 'skills', 'role', 'category', 'organization',
      'phone', 'dob', 'location', 'website', 'github', 'linkedin',
      'headline', 'experience', 'projects', 'education', 'profilePicture',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password')
      .populate('circles', 'name domain location members');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch joined groups from the GroupMember system
    const memberships = await GroupMember.find({ user: req.user.id, status: 'Approved' })
      .populate('group', 'name domain location description icon color');

    const joinedGroups = memberships
      .map(m => m.group)
      .filter(g => g !== null);

    res.json({ ...user.toObject(), joinedGroups });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// PUT /user/points  (requires auth middleware)
const updatePoints = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount === undefined) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { points: amount } }, // Increment by amount (can be negative)
      { new: true }
    ).select('points');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ points: user.points });
  } catch (err) {
    console.error('Update points error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /user/upload-avatar (requires auth middleware and multer)
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Return the accessible URL
    // We assume the backend is on port 5000 and serve static files from /uploads
    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({ url: fileUrl });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

// GET /user/:id  (requires auth middleware)
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email -phone') // Hide sensitive details
      .populate('circles', 'name domain location icon');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get public profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /user/connect/:id  (requires auth middleware)
const connectUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user.id;

    if (targetId === currentUserId) {
      return res.status(400).json({ message: "You cannot connect with yourself" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already connected
    if (currentUser.connections.includes(targetId)) {
      return res.status(400).json({ message: "Already connected" });
    }

    // Add to current user's connections
    currentUser.connections.push(targetId);
    // Add to target user's connections (mutual connection)
    targetUser.connections.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    // Notify target user
    const io = req.app.get('io');
    await createNotification(io, {
      userId: targetId,
      category: 'connection',
      type: 'connection_request', // or 'new_connection'
      message: `${currentUser.name} has connected with you!`,
      priority: 'medium'
    });

    res.json({ message: "Connected successfully", connectionsCount: currentUser.connections.length });
  } catch (err) {
    console.error('Connect user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /user/analytics
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregate counts by day
    const activities = await Activity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Ensure all 7 days are present in the result
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = activities.find(a => a._id === dateStr);
      last7Days.push({
        date: dateStr,
        count: found ? found.count : 0
      });
    }

    res.json(last7Days);
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /user/all
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('name profilePicture headline role organization circles');
    res.json(users);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /user/opened-circle (requires auth middleware)
const updateHasOpenedCircle = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { hasOpenedCircle: true } },
      { new: true }
    ).select('hasOpenedCircle');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ hasOpenedCircle: user.hasOpenedCircle });
  } catch (err) {
    console.error('Update opened circle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  updatePoints,
  uploadAvatar,
  getPublicProfile,
  connectUser,
  getUserAnalytics,
  getAllUsers,
  updateHasOpenedCircle
};
