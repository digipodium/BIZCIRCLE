require('dotenv').config();
require('./connection');
const mongoose = require('mongoose');
const User = require('./models/userModel');
const GroupMember = require('./models/groupMemberModel');
const Group = require('./models/groupModel');
const Circle = require('./models/circleModel');

async function test() {
  try {
    const user = await User.findOne();
    if (!user) {
      console.log('No users in DB to test with.');
      process.exit(0);
    }
    
    const populatedUser = await User.findById(user._id)
      .select('-password')
      .populate('circles', 'name domain location members');
      
    console.log('User populated successfully!');

    // Fetch joined groups from the GroupMember system
    const memberships = await GroupMember.find({ user: user._id, status: 'Approved' })
      .populate('group', 'name domain location description icon color');
      
    console.log('Memberships populated successfully!');

    const joinedGroups = memberships
      .map(m => m.group)
      .filter(g => g !== null);

    console.log({ ...populatedUser.toObject(), joinedGroups });
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

setTimeout(test, 2000); // Wait for connection
