import { UserModel, GigModel, ApplicationModel } from "./models.js";
import mongoose from "mongoose";

export class MongoStorage {
  async getUser(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const user = await UserModel.findById(id).lean();
    return user ? this.transformUser(user) : undefined;
  }

  async getUserByEmail(email) {
    const user = await UserModel.findOne({ email }).lean();
    return user ? this.transformUser(user) : undefined;
  }

  async createUser(insertUser) {
    const user = await UserModel.create(insertUser);
    return this.transformUser(user.toObject());
  }

  async updateUser(id, updates) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true }).lean();
    return user ? this.transformUser(user) : undefined;
  }

  async getGig(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const gig = await GigModel.findById(id).lean();
    return gig ? this.transformGig(gig) : undefined;
  }

  async getAllGigs() {
    const gigs = await GigModel.find().lean();
    return gigs.map(gig => this.transformGig(gig));
  }

  async getGigsByUser(userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return [];
    const gigs = await GigModel.find({ postedBy: userId }).lean();
    return gigs.map(gig => this.transformGig(gig));
  }

  async createGig(insertGig) {
    const gig = await GigModel.create({
      ...insertGig,
      applicants: [],
    });
    return this.transformGig(gig.toObject());
  }

  async updateGig(id, updates) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    
    const updateData = { ...updates };
    if (updates.applicants) {
      updateData.applicants = updates.applicants.map(id => new mongoose.Types.ObjectId(id));
    }
    
    const gig = await GigModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return gig ? this.transformGig(gig) : undefined;
  }

  async deleteGig(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await GigModel.findByIdAndDelete(id);
    return result !== null;
  }

  transformUser(doc) {
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

  transformGig(doc) {
    const id = doc._id ? doc._id.toString() : doc.id;
    const postedBy = doc.postedBy && typeof doc.postedBy === 'object' ? doc.postedBy.toString() : doc.postedBy;
    return {
      id,
      title: doc.title,
      description: doc.description,
      budget: doc.budget,
      location: doc.location,
      postedBy,
      applicants: doc.applicants ? doc.applicants.map((id) => 
        typeof id === 'object' ? id.toString() : id
      ) : [],
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async getApplication(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const application = await ApplicationModel.findById(id).lean();
    return application ? this.transformApplication(application) : undefined;
  }

  async getApplicationsByGig(gigId) {
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

  async getApplicationsByStudent(studentId) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) return [];
    const applications = await ApplicationModel.find({ studentId }).lean();
    return applications.map(app => this.transformApplication(app));
  }

  async createApplication(insertApplication) {
    const application = await ApplicationModel.create({
      ...insertApplication,
      status: 'pending',
    });
    return this.transformApplication(application.toObject());
  }

  async updateApplicationStatus(id, status) {
    if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
    const application = await ApplicationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    return application ? this.transformApplication(application) : undefined;
  }

  async getApplicationByGigAndStudent(gigId, studentId) {
    if (!mongoose.Types.ObjectId.isValid(gigId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return undefined;
    }
    const application = await ApplicationModel.findOne({ gigId, studentId }).lean();
    return application ? this.transformApplication(application) : undefined;
  }

  transformApplication(doc) {
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
