import type { User, Gig } from "@shared/types";
import { UserModel, GigModel } from "./models";
import mongoose from "mongoose";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<User, 'id'>): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Gig operations
  getGig(id: string): Promise<Gig | undefined>;
  getAllGigs(): Promise<Gig[]>;
  getGigsByUser(userId: string): Promise<Gig[]>;
  createGig(gig: Omit<Gig, 'id' | 'applicants'> & { postedBy: string }): Promise<Gig>;
  updateGig(id: string, updates: Partial<Gig>): Promise<Gig | undefined>;
  deleteGig(id: string): Promise<boolean>;
}

export class MongoStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const user = await UserModel.findById(id).lean();
    return user ? this.transformUser(user) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email }).lean();
    return user ? this.transformUser(user) : undefined;
  }

  async createUser(insertUser: Omit<User, 'id'>): Promise<User> {
    const user = await UserModel.create(insertUser);
    return this.transformUser(user.toObject());
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    return user ? this.transformUser(user) : undefined;
  }

  // Gig operations
  async getGig(id: string): Promise<Gig | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const gig = await GigModel.findById(id).lean();
    return gig ? this.transformGig(gig) : undefined;
  }

  async getAllGigs(): Promise<Gig[]> {
    const gigs = await GigModel.find().lean();
    return gigs.map(gig => this.transformGig(gig));
  }

  async getGigsByUser(userId: string): Promise<Gig[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    const gigs = await GigModel.find({ postedBy: userId }).lean();
    return gigs.map(gig => this.transformGig(gig));
  }

  async createGig(insertGig: Omit<Gig, 'id' | 'applicants'> & { postedBy: string }): Promise<Gig> {
    const gig = await GigModel.create({
      ...insertGig,
      applicants: [],
    });
    return this.transformGig(gig.toObject());
  }

  async updateGig(id: string, updates: Partial<Gig>): Promise<Gig | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    
    const updateData: any = { ...updates };
    if (updates.applicants) {
      updateData.applicants = updates.applicants.map(id => new mongoose.Types.ObjectId(id));
    }
    
    const gig = await GigModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return gig ? this.transformGig(gig) : undefined;
  }

  async deleteGig(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await GigModel.findByIdAndDelete(id);
    return result !== null;
  }

  // Transform methods to convert MongoDB documents to frontend types
  private transformUser(doc: any): User {
    const id = doc._id ? doc._id.toString() : doc.id;
    return {
      id,
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      skills: doc.skills || [],
      bio: doc.bio,
      companyName: doc.companyName,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private transformGig(doc: any): Gig {
    const id = doc._id ? doc._id.toString() : doc.id;
    const postedBy = doc.postedBy && typeof doc.postedBy === 'object' ? doc.postedBy.toString() : doc.postedBy;
    return {
      id,
      title: doc.title,
      description: doc.description,
      budget: doc.budget,
      location: doc.location,
      postedBy,
      applicants: doc.applicants ? doc.applicants.map((id: any) => 
        typeof id === 'object' ? id.toString() : id
      ) : [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

export const storage = new MongoStorage();
