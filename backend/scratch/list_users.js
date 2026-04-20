require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'email role name');
    console.log('--- USERS IN DATABASE ---');
    users.forEach(u => {
      console.log(`Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`);
    });
    console.log('-------------------------');
    process.exit(0);
  } catch (err) {
    console.error('Error listing users:', err);
    process.exit(1);
  }
}

listUsers();
