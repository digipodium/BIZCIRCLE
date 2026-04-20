const mongoose = require('mongoose');

async function testConnection() {
    console.log('Testing connection to MongoDB...');
    try {
        const uri = "mongodb+srv://Shreya123:123abc@cluster0.qquky8z.mongodb.net/mydb1408?appName=Cluster0";
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('SUCCESS! MongoDB connected perfectly from this machine.');
        process.exit(0);
    } catch (error) {
        console.error('FAILED TO CONNECT:');
        console.error(error.message);
        process.exit(1);
    }
}

testConnection();
