import type { User, Gig, Application } from "@shared/types";
import { UserModel, GigModel, ApplicationModel } from "./models";
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
  
  // Application operations
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationsByGig(gigId: string): Promise<Application[]>;
  getApplicationsByStudent(studentId: string): Promise<Application[]>;
  createApplication(application: Omit<Application, 'id' | 'status'>): Promise<Application>;
  updateApplicationStatus(id: string, status: Application['status']): Promise<Application | undefined>;
  getApplicationByGigAndStudent(gigId: string, studentId: string): Promise<Application | undefined>;
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

  // Application operations
  async getApplication(id: string): Promise<Application | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const application = await ApplicationModel.findById(id).lean();
    return application ? this.transformApplication(application) : undefined;
  }

  async getApplicationsByGig(gigId: string): Promise<any[]> {
    if (!mongoose.Types.ObjectId.isValid(gigId)) return [];
    const applications = await ApplicationModel.find({ gigId }).lean();
    
    const applicationsWithStudent = await Promise.all(
      applications.map(async (app) => {
        const student = await UserModel.findById(app.studentId).lean();
        return {
          ...this.transformApplication(app),
          student: student ? this.transformUser(student) : undefined,
        };
      })
    );
    
    return applicationsWithStudent;
  }

  async getApplicationsByStudent(studentId: string): Promise<Application[]> {
    if (!mongoose.Types.ObjectId.isValid(studentId)) return [];
    const applications = await ApplicationModel.find({ studentId }).lean();
    return applications.map(app => this.transformApplication(app));
  }

  async createApplication(insertApplication: Omit<Application, 'id' | 'status'>): Promise<Application> {
    const application = await ApplicationModel.create({
      ...insertApplication,
      status: 'pending',
    });
    return this.transformApplication(application.toObject());
  }

  async updateApplicationStatus(id: string, status: Application['status']): Promise<Application | undefined> {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const application = await ApplicationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    return application ? this.transformApplication(application) : undefined;
  }

  async getApplicationByGigAndStudent(gigId: string, studentId: string): Promise<Application | undefined> {
    if (!mongoose.Types.ObjectId.isValid(gigId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return undefined;
    }
    const application = await ApplicationModel.findOne({ gigId, studentId }).lean();
    return application ? this.transformApplication(application) : undefined;
  }

  private transformApplication(doc: any): Application {
    const id = doc._id ? doc._id.toString() : doc.id;
    const gigId = doc.gigId && typeof doc.gigId === 'object' ? doc.gigId.toString() : doc.gigId;
    const studentId = doc.studentId && typeof doc.studentId === 'object' ? doc.studentId.toString() : doc.studentId;
    return {
      id,
      gigId,
      studentId,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

export const storage = new MongoStorage();
