require('dotenv').config();
const mongoose = require('./connection');
const User = require('./models/userModel');
const GroupMember = require('./models/groupMemberModel');
setTimeout(async () => {
  try {
    console.log('Running test...');
    const user = await User.findOne();
    if(!user) {
      console.log('no user');
      process.exit(0);
    }
    await User.findById(user._id).select('-password').populate('circles', 'name domain location members');
    console.log('User populated');
    const memberships = await GroupMember.find({ user: user._id, status: 'Approved' }).populate('group', 'name domain location description icon color');
    console.log('Memberships populated');
    process.exit(0);
  } catch(err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}, 5000);
