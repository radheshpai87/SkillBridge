import { z } from "zod";

// Request validation schemas using Zod

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['student', 'business']),
  skills: z.array(z.string()).optional(),
  bio: z.string().optional(),
  companyName: z.string().optional(),
  description: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const gigSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  budget: z.number().positive("Budget must be positive"),
  location: z.string().min(1, "Location is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  companyName: z.string().optional(),
  description: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GigInput = z.infer<typeof gigSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
