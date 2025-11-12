import { z } from 'zod';
import { ValidationError } from '../utils/errors.js';

export const validate = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.parseAsync(req.body);
    req.body = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      const validationError = new ValidationError('Validation failed', errors);
      next(validationError);
    } else {
      next(error);
    }
  }
};

export const validateParams = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.parseAsync(req.params);
    req.params = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      const validationError = new ValidationError('Invalid URL parameters', errors);
      next(validationError);
    } else {
      next(error);
    }
  }
};

export const validateQuery = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.parseAsync(req.query);
    req.query = validated;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      const validationError = new ValidationError('Invalid query parameters', errors);
      next(validationError);
    } else {
      next(error);
    }
  }
};
