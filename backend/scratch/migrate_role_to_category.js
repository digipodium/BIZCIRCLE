// backend/scratch/migrate_role_to_category.js
const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bizcircle';

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const professionalCategories = ["Entrepreneur", "Student", "Professional", "Freelancer", "Investor"];
    
    // Find users whose role is one of the professional categories
    const usersToMigrate = await User.find({ role: { $in: professionalCategories } });
    console.log(`Found ${usersToMigrate.length} users to migrate.`);

    for (let user of usersToMigrate) {
      console.log(`Migrating user: ${user.email} (Role: ${user.role})`);
      user.category = user.role;
      user.role = 'user';
      await user.save();
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
