const mongoose = require('mongoose');
require('dotenv').config();

async function checkActivities() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        // Register models manually to avoid issues
        require('../models/userModel');
        require('../models/groupModel');
        require('../models/circleModel');
        const Activity = require('../models/activityModel');
        
        const activities = await Activity.find().limit(10);
        console.log('Total activities:', await Activity.countDocuments());
        console.log('Sample activities:', JSON.stringify(activities, null, 2));
        
        // Try to populate
        try {
            const populated = await Activity.find().limit(5).populate('targetId');
            console.log('Population successful');
        } catch (err) {
            console.error('Population failed:', err.message);
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkActivities();
