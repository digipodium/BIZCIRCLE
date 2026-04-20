const User = require('../models/userModel');
const GroupMember = require('../models/groupMemberModel');
const Group = require('../models/groupModel');
const Circle = require('../models/circleModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mytopseret';

// POST /user/signup
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

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
      role: role || 'user',
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

// GET /user/profile  (requires auth middleware)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
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
    console.error('Get profile error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// PUT /user/profile  (requires auth middleware)
const updateUserProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'bio', 'skills', 'role', 'organization',
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

const getUserAnalytics = async (req, res) => {
  try {
    const Activity = require('../models/activityModel');
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const activities = await Activity.find({
      userId: req.user.id,
      createdAt: { $gte: sevenDaysAgo, $lte: today }
    });

    const dailyData = {};
    // Initialize last 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      dailyData[dateStr] = 0;
    }

    activities.forEach(act => {
      const dateStr = act.createdAt.toISOString().split('T')[0];
      if (dailyData[dateStr] !== undefined) {
        dailyData[dateStr]++;
      }
    });

    const results = Object.keys(dailyData).sort().map(date => ({
      date,
      count: dailyData[date]
    }));

    res.json(results);
  } catch (err) {
    console.error('Get analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, getUserProfile, updateUserProfile, updatePoints, uploadAvatar, getUserAnalytics };
