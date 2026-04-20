const mongoose = require('mongoose');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@bizcircle.com';
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.findOneAndUpdate(
            { email: 'admin@bizcircle.com' },
            { password: hashedPassword, role: 'admin' },
            { new: true, upsert: true } // Create if doesn't exist
        );
        if (admin) {
            console.log('Admin ready:', admin.email);
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

updateAdmin();
