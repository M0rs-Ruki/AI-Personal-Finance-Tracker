import mongoose from "mongoose";

const unEmployedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  employmentStatus: {
    type: String,
    enum: ['actively-seeking', 'taking-break', 'studying', 'caring', 'disabled'],
    default: 'actively-seeking'
  },
  lastJobDetails: {
    industry: {
      type: String,
      trim: true,
      maxlength: 100
    },
    position: {
      type: String,
      trim: true,
      maxlength: 100
    },
    duration: Number // months
  },
  currentIncome: {
    type: Number,
    min: 0,
    set: value => Math.round(value * 100) / 100 // Store with 2 decimal precision
  },
  incomeSources: [{
    sourceType: {
      type: String,
      enum: ["freelance", "government-aid", "family-support", "savings", "part-time", "other"],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "bi-weekly", "monthly", "quarterly", "annually", "irregular"],
      default: "monthly"
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],
  savingsDetails: {
    amount: {
      type: Number,
      min: 0,
      default: 0
    },
    emergencyFund: {
      type: Number,
      min: 0
    },
    monthsCovered: {
      type: Number,
      min: 0,
      max: 36
    }
  },
  regularExpenses: [{
    category: {
      type: String,
      trim: true,
      maxlength: 50
    },
    amount: {
      type: Number,
      min: 0
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "quarterly", "annually"],
      default: "monthly"
    },
    essential: {
      type: Boolean,
      default: true
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
    },
    currentSpending: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  financialGoals: [{
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    type: {
      type: String,
      enum: ["emergency-fund", "debt-repayment", "job-search", "skill-development", "other"],
      default: "job-search"
    },
    targetAmount: {
      type: Number,
      min: 0
    },
    targetDate: Date,
    priority: {
      type: String,
      enum: ["critical", "high", "medium", "low"],
      default: "medium"
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  jobSearchDetails: {
    active: {
      type: Boolean,
      default: false
    },
    applicationsPerWeek: {
      type: Number,
      min: 0,
      max: 50
    },
    jobSearchBudget: {
      type: Number,
      min: 0
    },
    industriesTargeted: [String],
    skillsDevelopment: [String]
  },
  summaryFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'bi-weekly', 'monthly'],
    default: 'weekly'
  },
  supportResources: {
    wantsBudgetHelp: {
      type: Boolean,
      default: false
    },
    wantsJobResources: {
      type: Boolean,
      default: false
    },
    wantsDebtAdvice: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total monthly expenses
unEmployedSchema.virtual('totalMonthlyExpenses').get(function() {
  let total = 0;
  
  this.regularExpenses.forEach(expense => {
    if (expense.frequency === 'daily') {
      total += expense.amount * 30;
    } else if (expense.frequency === 'weekly') {
      total += expense.amount * 4.33;
    } else if (expense.frequency === 'monthly') {
      total += expense.amount;
    } else if (expense.frequency === 'quarterly') {
      total += expense.amount / 3;
    } else if (expense.frequency === 'annually') {
      total += expense.amount / 12;
    }
  });
  
  return parseFloat(total.toFixed(2));
});

// Virtual for monthly income from all sources
unEmployedSchema.virtual('totalMonthlyIncome').get(function() {
  let total = this.currentIncome;
  
  this.incomeSources.forEach(source => {
    if (source.frequency === 'daily') {
      total += source.amount * 30;
    } else if (source.frequency === 'weekly') {
      total += source.amount * 4.33;
    } else if (source.frequency === 'monthly') {
      total += source.amount;
    } else if (source.frequency === 'quarterly') {
      total += source.amount / 3;
    } else if (source.frequency === 'annually') {
      total += source.amount / 12;
    }
  });
  
  return parseFloat(total.toFixed(2));
});

// Virtual for months of savings coverage
unEmployedSchema.virtual('savingsCoverage').get(function() {
  if (this.totalMonthlyExpenses <= 0) return 0;
  return (this.savingsDetails.amount / this.totalMonthlyExpenses).toFixed(1);
});

// Indexes
unEmployedSchema.index({ employmentStatus: 1 });
unEmployedSchema.index({ 'financialGoals.priority': 1, 'financialGoals.targetDate': 1 });
unEmployedSchema.index({ 'jobSearchDetails.active': 1 });

// Pre-save hook to calculate emergency fund months covered
unEmployedSchema.pre('save', function(next) {
  if (this.savingsDetails.amount > 0 && this.totalMonthlyExpenses > 0) {
    this.savingsDetails.monthsCovered = parseFloat(
      (this.savingsDetails.amount / this.totalMonthlyExpenses).toFixed(1)
    );
  }
  next();
});

const UnEmployed = mongoose.model('UnEmployed', unEmployedSchema);

export default UnEmployed;