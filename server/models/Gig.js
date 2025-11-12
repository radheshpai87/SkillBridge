import mongoose from 'mongoose';

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
      ret.applicants = ret.applicants.map((id) => id.toString());
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export default mongoose.model('Gig', gigSchema);
