import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { storage } from '../services/storageService.js';
import { ValidationError, UnauthorizedError, ConflictError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const sanitizeUser = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, skills, bio, companyName, description } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    throw new ValidationError('Missing required fields: name, email, password, role');
  }

  if (!['student', 'business'].includes(role)) {
    throw new ValidationError('Invalid role. Must be "student" or "business"');
  }

  // Check if user exists
  const existingUser = await storage.getUserByEmail(email);
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await storage.createUser({
    name,
    email,
    password: hashedPassword,
    role,
    skills: skills || [],
    bio,
    companyName,
    description,
  });

  // Generate token
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find user
  const user = await storage.getUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user.id);

  res.status(200).json({
    success: true,
    token,
    user: sanitizeUser(user),
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, skills, companyName, description, coordinates } = req.body;
  const userId = req.user.id;

  const updates = {};
  if (name) updates.name = name;
  if (bio !== undefined) updates.bio = bio;
  if (skills) updates.skills = skills;
  if (companyName !== undefined) updates.companyName = companyName;
  if (description !== undefined) updates.description = description;
  if (coordinates) updates.coordinates = coordinates;

  const updatedUser = await storage.updateUser(userId, updates);
  
  if (!updatedUser) {
    throw new NotFoundError('User not found');
  }

  res.json({
    success: true,
    user: sanitizeUser(updatedUser),
  });
});
