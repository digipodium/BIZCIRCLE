// backend/scratch/cleanup_circles.js
const { connectDB, mongoose } = require('../connection');
const Circle = require('../models/circleModel');
require('dotenv').config();

async function cleanup() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        const dummyIds = [
            "69e66c303cb33c2b6414b0dc", // "my circle"
            "69d6a2865d3fb0af73445087"  // "Social Media Bangalore"
        ];

        const result = await Circle.deleteMany({ _id: { $in: dummyIds } });
        console.log(`Deleted ${result.deletedCount} dummy circles.`);

        // Also delete circles with very short/gibberish names or descriptions if any
        const gibberishResult = await Circle.deleteMany({
            $or: [
                { description: /^[a-z]{10,}$/i }, // e.g. "kjdbjfhdskk"
                { name: /^test/i }
            ]
        });
        console.log(`Deleted ${gibberishResult.deletedCount} gibberish/test circles.`);

        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanup();
