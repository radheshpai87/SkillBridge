import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - supports both students and businesses
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(), // "student" or "business"
  skills: text("skills"), // JSON array string for student skills
  bio: text("bio"), // student bio
  companyName: text("company_name"), // business company name
  description: text("description"), // business description
});

// Gigs table - opportunities posted by businesses
export const gigs = pgTable("gigs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  budget: integer("budget").notNull(),
  location: text("location").notNull(),
  postedBy: varchar("posted_by").notNull(), // user id of business
  applicants: text("applicants"), // JSON array string of user ids
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
}).extend({
  skills: z.array(z.string()).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertGigSchema = createInsertSchema(gigs).omit({
  id: true,
  postedBy: true,
  applicants: true,
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  companyName: z.string().optional(),
  description: z.string().optional(),
});

// TypeScript types with proper array types for frontend
export type User = Omit<typeof users.$inferSelect, 'skills'> & {
  skills: string[] | null;
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;

export type Gig = Omit<typeof gigs.$inferSelect, 'applicants'> & {
  applicants: string[];
};

export type InsertGig = z.infer<typeof insertGigSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
