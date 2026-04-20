require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');

async function promoteToAdmin(email) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate({ email: email }, { role: 'admin' }, { new: true });
    if (user) {
      console.log(`User ${email} promoted to admin successfully.`);
    } else {
      console.log(`User ${email} not found.`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error promoting user:', err);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email as an argument.');
  process.exit(1);
}

promoteToAdmin(email);
