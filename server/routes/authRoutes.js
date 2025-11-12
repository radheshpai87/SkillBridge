import { Router } from 'express';
import { register, login, getCurrentUser, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.patch('/profile/update', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
