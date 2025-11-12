import { config } from '../config/env.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error
  if (error.statusCode >= 500) {
    logger.error('Server Error:', err);
  } else {
    logger.warn(`Client Error: ${error.message}`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    error.statusCode = 409;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    error.message = 'Validation error';
    error.statusCode = 400;
    error.errors = errors;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Response object
  const response = {
    success: false,
    message: error.message || 'Server Error',
  };

  // Add errors array if exists
  if (error.errors) {
    response.errors = error.errors;
  }

  // Add stack trace in development
  if (config.isDevelopment && err.stack) {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
};

export const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Async handler wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
