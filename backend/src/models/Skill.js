import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide skill name'],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide skill category'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

skillSchema.index({ category: 1, name: 1 });

export default mongoose.model('Skill', skillSchema);
