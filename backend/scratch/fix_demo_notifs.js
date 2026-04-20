require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const AdminNotification = require('../models/adminNotificationModel');

async function cleanAndSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const adminEmail = 'mukharjeesudeshna43@gmail.com';
    const user = await User.findOne({ email: adminEmail });
    
    if (user) {
      // 1. Clear regular notifications for this user (they are distracting for an admin)
      await Notification.deleteMany({ userId: user._id });
      console.log('Cleared old user notifications for admin.');
    }

    // 2. Clear and re-seed AdminNotifications (system-wide)
    await AdminNotification.deleteMany({});
    
    const adminNotifs = [
      { message: "New user registered: Regina George", type: "user_registered", priority: "low", isRead: false },
      { message: "3 reports pending review for 'Offensive Content'", type: "report_pending", priority: "high", isRead: false },
      { message: "User 'Leon Kennedy' flagged multiple times for spam", type: "user_flagged", priority: "medium", isRead: false },
      { message: "New group created: 'Tech Enthusiasts'", type: "group_created", priority: "low", isRead: false },
      { message: "System configuration updated by Admin", type: "system_config", priority: "medium", isRead: true },
      { message: "Maintenance window scheduled for tomorrow 2 AM", type: "system_config", priority: "high", isRead: false },
    ];

    await AdminNotification.insertMany(adminNotifs);
    console.log('Seeded fresh admin notifications.');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

cleanAndSeed();
