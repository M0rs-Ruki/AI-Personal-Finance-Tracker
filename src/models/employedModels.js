import mongoose from "mongoose";

const employerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: 100
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'self-employed', 'freelance'],
    lowercase: true,
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  workIndustry: {
    type: String,
    trim: true,
    maxlength: 100
  },
  workLocation: {
    type: String,
    trim: true,
    maxlength: 100
  },
  monthlySalary: {
    type: Number,
    min: 0,
    set: value => Math.round(value * 100) / 100 // Store with 2 decimal precision
  },
  payFrequency: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'monthly', 'semi-monthly', 'annually'],
    default: 'monthly',
    lowercase: true,
  },
  additionalIncomeSources: [{
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'annually', 'irregular'],
      default: 'monthly',
      lowercase: true,
    }
  }],
  hasBonuses: {
    type: Boolean,
    default: false
  },
  bonusDetails: {
    type: {
      amount: Number,
      frequency: {
        type: String,
        enum: ['quarterly', 'semi-annual', 'annual', 'project-based'],
        lowercase: true,
      },
      lastReceived: Date
    },
    required: function() { return this.hasBonuses; }
  },
  fixedExpenses: [{
    category: {
      type: String,
      trim: true,
      maxlength: 50
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    dueDate: {
      type: Number,
      min: 1,
      max: 31
    }
  }],
  budgetLimits: [{
    category: {
      type: String,
      trim: true,
      maxlength: 50
    },
    limit: {
      type: Number,
      min: 0
    }
  }],
  financialGoals: [{
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    targetAmount: {
      type: Number,
      min: 0
    },
    targetDate: Date,
    currentProgress: {
      type: Number,
      default: 0,
      min: 0
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      lowercase: true,
    }
  }],
  summaryFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
    default: 'weekly',
    lowercase: true,
  },
  investmentPreferences: {
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high'],
      default: 'medium',
      lowercase: true,
    },
    interestedIn: [{
      type: String,
      enum: ['stocks', 'bonds', 'mutual-funds', 'etfs', 'real-estate', 'crypto', 'retirement-accounts'],
      lowercase: true,
    }],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      lowercase: true,
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// Virtual for total monthly income
employerSchema.virtual('totalMonthlyIncome').get(function() {
  let total = this.monthlySalary;
  
  this.additionalIncomeSources.forEach(source => {
    if (source.frequency === 'weekly') {
      total += source.amount * 4.33; // Average weeks per month
    } else if (source.frequency === 'monthly') {
      total += source.amount;
    } else if (source.frequency === 'quarterly') {
      total += source.amount / 3;
    } else if (source.frequency === 'annually') {
      total += source.amount / 12;
    }
  });
  
  if (this.hasBonuses && this.bonusDetails) {
    if (this.bonusDetails.frequency === 'quarterly') {
      total += (this.bonusDetails.amount || 0) / 3;
    } else if (this.bonusDetails.frequency === 'semi-annual') {
      total += (this.bonusDetails.amount || 0) / 6;
    } else if (this.bonusDetails.frequency === 'annual') {
      total += (this.bonusDetails.amount || 0) / 12;
    }
  }
  
  return parseFloat(total.toFixed(2));
});

// Indexes
employerSchema.index({ workIndustry: 1 });
employerSchema.index({ employmentType: 1 });
employerSchema.index({ 'financialGoals.targetDate': 1 });

// Pre-save hook to update bonus details if hasBonuses is false
employerSchema.pre('save', function(next) {
  if (!this.hasBonuses) {
    this.bonusDetails = undefined;
  }
  next();
});

const Employer = mongoose.model('Employer', employerSchema);

export default Employer;