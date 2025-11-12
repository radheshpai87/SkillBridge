import mongoose from 'mongoose';
import { config } from './env.js';
import logger from '../utils/logger.js';

export async function connectDatabase() {
  try {
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      logger.info('✅ Already connected to MongoDB');
      return;
    }

    // If connecting, wait for it
    if (mongoose.connection.readyState === 2) {
      logger.info('⏳ Waiting for MongoDB connection...');
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
      return;
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased for serverless
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable buffering for serverless
    };

    await mongoose.connect(config.mongodb.uri, options);
    logger.info('✅ Connected to MongoDB successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    // Don't exit in serverless environment
    if (config.isProduction && process.env.VERCEL) {
      throw error;
    } else {
      process.exit(1);
    }
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
}

// Event handlers
mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});
