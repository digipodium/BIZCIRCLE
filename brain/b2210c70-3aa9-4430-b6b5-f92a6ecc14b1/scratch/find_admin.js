const mongoose = require('mongoose');
const User = require('../../backend/models/userModel');
require('dotenv').config({ path: '../../backend/.env' });

const findAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
            console.log('Admin found:', admin.email);
            // I won't print password here for security, but I can check if it has one
            console.log('Has password:', !!admin.password);
        } else {
            console.log('No admin found.');
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

findAdmin();
