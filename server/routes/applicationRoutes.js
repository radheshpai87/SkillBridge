import { Router } from 'express';
import {
  applyToGig,
  getApplicationsByGig,
  getMyApplications,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createApplicationSchema, updateApplicationStatusSchema } from '../validators.js';

const router = Router();

// All routes are protected
router.use(authenticate);

// Student routes
router.post('/gig/:gigId', authorize('student'), validate(createApplicationSchema), applyToGig);
router.get('/my', authorize('student'), getMyApplications);

// Business routes
router.get('/gig/:gigId', authorize('business'), getApplicationsByGig);
router.patch('/:id/status', authorize('business'), validate(updateApplicationStatusSchema), updateApplicationStatus);

export default router;
