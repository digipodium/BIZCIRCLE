require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

async function resetPassword(email, newPassword) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate({ email: email }, { password: hashedPassword }, { new: true });
    if (user) {
      console.log(`Password for ${email} reset successfully.`);
    } else {
      console.log(`User ${email} not found.`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error resetting password:', err);
    process.exit(1);
  }
}

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.log('Usage: node reset_password.js <email> <newPassword>');
  process.exit(1);
}

resetPassword(email, newPassword);
