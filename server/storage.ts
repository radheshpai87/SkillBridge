import { type User, type InsertUser, type Gig, type InsertGig } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Gig operations
  getGig(id: string): Promise<Gig | undefined>;
  getAllGigs(): Promise<Gig[]>;
  getGigsByUser(userId: string): Promise<Gig[]>;
  createGig(gig: InsertGig & { postedBy: string }): Promise<Gig>;
  updateGig(id: string, updates: Partial<Gig>): Promise<Gig | undefined>;
  deleteGig(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gigs: Map<string, Gig>;

  constructor() {
    this.users = new Map();
    this.gigs = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      skills: insertUser.skills ? JSON.stringify(insertUser.skills) : null,
      bio: insertUser.bio || null,
      companyName: insertUser.companyName || null,
      description: insertUser.description || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Gig operations
  async getGig(id: string): Promise<Gig | undefined> {
    return this.gigs.get(id);
  }

  async getAllGigs(): Promise<Gig[]> {
    return Array.from(this.gigs.values());
  }

  async getGigsByUser(userId: string): Promise<Gig[]> {
    return Array.from(this.gigs.values()).filter(
      (gig) => gig.postedBy === userId,
    );
  }

  async createGig(insertGig: InsertGig & { postedBy: string }): Promise<Gig> {
    const id = randomUUID();
    const gig: Gig = {
      ...insertGig,
      id,
      applicants: null,
    };
    this.gigs.set(id, gig);
    return gig;
  }

  async updateGig(id: string, updates: Partial<Gig>): Promise<Gig | undefined> {
    const gig = this.gigs.get(id);
    if (!gig) return undefined;
    
    const updatedGig = { ...gig, ...updates };
    this.gigs.set(id, updatedGig);
    return updatedGig;
  }

  async deleteGig(id: string): Promise<boolean> {
    return this.gigs.delete(id);
  }
}

export const storage = new MemStorage();
