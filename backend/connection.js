require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

if (!url) {
  console.error('❌ MONGO_URI is not defined in .env file');
  process.exit(1);
}

const connectDB = async (retryCount = 5) => {
  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
    });
    console.log('✅ Database connected successfully');
  } catch (err) {
    if (retryCount > 0) {
      console.warn(`⚠️ Database connection failed. Retrying in 5 seconds... (${retryCount} retries left)`);
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retryCount - 1);
    } else {
      console.error('❌ Database connection permanently failed:', err);
      throw err; // Rethrow to let the caller handle permanent failure
    }
  }
};

mongoose.connection.on('error', err => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Trying to reconnect...');
});

const { Schema, model, Types } = mongoose;

module.exports = { connectDB, mongoose, Schema, model, Types };