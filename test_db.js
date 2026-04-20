const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');

    const User = require('./backend/models/userModel');
    const GroupMember = require('./backend/models/groupMemberModel');
    const Activity = require('./backend/models/activityModel');
    const Circle = require('./backend/models/circleModel');
    const Group = require('./backend/models/groupModel');

    const modelNames = mongoose.modelNames();
    console.log('Registered Models:', modelNames);

    // Test a simple query like what's in getUserProfile
    const user = await User.findOne().populate('circles');
    console.log('User found and populated circles');

    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

test();
