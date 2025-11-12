import { Router } from 'express';
import authRoutes from './authRoutes.js';
import gigRoutes from './gigRoutes.js';
import applicationRoutes from './applicationRoutes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/gigs', gigRoutes);
router.use('/applications', applicationRoutes);

// Health check
router.get('/health', async (req, res) => {
  const mongoose = (await import('mongoose')).default;
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatusMap[dbStatus] || 'unknown',
      uri: process.env.MONGODB_URI ? `${process.env.MONGODB_URI.substring(0, 20)}...` : 'NOT SET'
    },
    vercel: process.env.VERCEL ? 'true' : 'false'
  });
});

export default router;
