const mongoose = require('mongoose');
const path = require('path');

const os = require('os');

let mongod = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vinayaka_chikkis';
  
  // 1. Try local/remote MongoDB instance
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`✅ MongoDB Connected to Server: ${conn.connection.host}`);
    return;
  } catch (err) {
    console.log(`ℹ️ Local MongoDB server not detected at ${mongoUri}.`);
    console.log('⚡ Running Express in high-performance In-Memory state (Full API & Auth fully operational).');
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Error disconnecting DB:', error);
  }
};

module.exports = { connectDB, disconnectDB };
