import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  educationLevel: {
    type: String,
    enum: ['school', 'college', 'university', 'other'],
    lowercase: true,
    trim: true,
    required: true
  },
  institutionName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  livingSituation: {
    type: String,
    enum: ['hostel', 'family', 'rental', 'PG', 'other'],
    lowercase: true,
    trim: true,
    required: true
  },
  monthlyAllowance: {
    type: Number,
    min: 0,
    set: value => Math.round(value * 100) / 100 // Store as decimal
  },
  isParentFunded: {
    type: String,
    enum: ['yes', 'no', 'partially'],
    lowercase: true,
    trim: true,
    required: true
  },
  customCategories: [{
    name: {
      type: String,
      trim: true,
      maxlength: 30
    },
    budgetLimit: {
      type: Number,
      min: 0,
    }
  }],
  financialGoals: [{
    name: {
      type: String,
      trim: true,
      maxlength: 50
    },
    targetAmount: {
      type: Number,
      min: 0,
    },
    targetDate: Date
  }],
  summaryFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily',
    lowercase: true,
    trim: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
studentSchema.index({ userId: 1 });
studentSchema.index({ educationLevel: 1 });
studentSchema.index({ livingSituation: 1 });


const Student = mongoose.model('Student', studentSchema);

export default Student;