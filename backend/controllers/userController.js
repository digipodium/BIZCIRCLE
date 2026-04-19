const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createNotification } = require('./notificationController');

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

    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
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

    res.json(user);
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

module.exports = { signup, login, getUserProfile, updateUserProfile, updatePoints, uploadAvatar, getPublicProfile, connectUser };
