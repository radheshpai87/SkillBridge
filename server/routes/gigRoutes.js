import { Router } from 'express';
import {
  createGig,
  getAllGigs,
  getGig,
  getMatchedGigs,
  getMyGigs,
  updateGig,
  deleteGig,
} from '../controllers/gigController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { gigSchema } from '../validators.js';

const router = Router();

// Public routes
router.get('/all', getAllGigs);

// Protected routes - Student (must come before /:gigId to avoid matching)
router.get('/matched', authenticate, authorize('student'), getMatchedGigs);

// Protected routes - Business (must come before /:gigId to avoid matching)
router.post('/create', authenticate, authorize('business'), validate(gigSchema), createGig);
router.get('/my', authenticate, authorize('business'), getMyGigs);

// Specific gig routes (these use :gigId parameter)
router.get('/:gigId', getGig);
router.patch('/:gigId', authenticate, authorize('business'), validate(gigSchema.partial()), updateGig);
router.delete('/:gigId', authenticate, authorize('business'), deleteGig);

export default router;
