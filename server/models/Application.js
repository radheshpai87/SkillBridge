import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  applicationMessage: {
    type: String,
    required: false, // Optional for backward compatibility with existing applications
    maxlength: 1000,
    default: 'Application submitted before message feature was implemented.'
  },
  rejectionReason: {
    type: String,
    default: null
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

export default mongoose.model('Application', applicationSchema);
