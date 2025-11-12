import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { storage } from '../services/storageService.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { asyncHandler } from './errorHandler.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      throw new UnauthorizedError('User not found');
    }
    
    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Invalid token');
    }
    throw error;
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `User role '${req.user.role}' is not authorized to access this resource`
      );
    }

    next();
  };
};

// Optional authentication - doesn't throw error if no token
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await storage.getUser(decoded.userId);
    
    if (user) {
      req.user = user;
      req.userId = user.id;
    }
  } catch (error) {
    // Silently fail for optional auth
  }
  
  next();
});
