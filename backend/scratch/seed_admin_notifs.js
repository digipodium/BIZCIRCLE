require('dotenv').config();
const mongoose = require('mongoose');
const AdminNotification = require('../models/adminNotificationModel');

async function seedNotifications() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const tests = [
      { message: "New user registered", type: "user_registered", priority: "low", isRead: false },
      { message: "3 reports pending review", type: "report_pending", priority: "high", isRead: false },
      { message: "User flagged multiple times", type: "user_flagged", priority: "medium", isRead: false },
      { message: "New group created", type: "group_created", priority: "low", isRead: false },
      { message: "System configuration updated", type: "system_config", priority: "medium", isRead: true },
    ];

    await AdminNotification.insertMany(tests);
    console.log('Seeded 5 admin notifications.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding notifications:', err);
    process.exit(1);
  }
}

seedNotifications();
