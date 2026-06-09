const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    logger.info(`MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;