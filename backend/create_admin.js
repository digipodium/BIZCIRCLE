const mongoose = require('mongoose');
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'admin@bizcircle.com';
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('Admin already exists.');
            await mongoose.disconnect();
            return;
        }
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'System Admin',
            email,
            password: hashedPassword,
            role: 'admin',
            points: 9999
        });
        console.log('Admin created: admin@bizcircle.com / admin123');
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

createAdmin();
