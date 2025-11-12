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
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
