import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'business'] },
  skills: [{ type: String }],
  bio: String,
  companyName: String,
  description: String,
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  location: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      ret.postedBy = ret.postedBy.toString();
      ret.applicants = ret.applicants.map((id: mongoose.Types.ObjectId) => id.toString());
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const applicationSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      ret.gigId = ret.gigId.toString();
      ret.studentId = ret.studentId.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const UserModel = mongoose.model('User', userSchema);
export const GigModel = mongoose.model('Gig', gigSchema);
export const ApplicationModel = mongoose.model('Application', applicationSchema);
