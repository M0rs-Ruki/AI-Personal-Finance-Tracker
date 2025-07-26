import mongoose from "mongoose";

const retiredUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // 1. INCOME SOURCES
  pension: {
    receives: { type: Boolean, default: false },
    amount: { type: Number, min: 0 },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'semi-annual', 'annual'],
      default: 'monthly'
    }
  },
  otherIncomeSources: {
    type: [{
      source: { type: String, trim: true },
      amount: { type: Number, min: 0 },
      frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'semi-annual', 'annual', 'occasional'],
        default: 'monthly'
      }
    }],
    default: []
  },
  retirementAccountWithdrawals: {
    type: [{
      type: {
        type: String,
        enum: [
          'EPF (Employee Provident Fund)',
          'NPS (National Pension System)',
          'PPF (Public Provident Fund)',
          'Annuity (Pension Plans from Insurance Companies)',
          'other'
        ],
        trim: true
      },
      monthlyAmount: { type: Number, min: 0 }
    }],
    default: []
  },

  // 2. EXPENSES
  housing: {
    mortgageOrRent: { type: Number, min: 0 },
    insurance: { type: Number, min: 0 },
    maintenance: { type: Number, min: 0 }
  },
  healthcare: {
    monthlyPremium: { type: Number, min: 0 },
    outOfPocket: { type: Number, min: 0 }
  },
  otherExpenses: {
    type: [{
      name: { type: String, trim: true },
      amount: { type: Number, min: 0 },
      frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'annual'],
        default: 'monthly'
      }
    }],
    default: []
  },

  // 3. ASSETS
  retirementAccounts: {
    type: [{
      type: {
        type: String,
        enum: [
          'EPF (Employee Provident Fund)',
          'NPS (National Pension System)',
          'PPF (Public Provident Fund)',
          'Annuity (Pension Plans from Insurance Companies)',
          'other'
        ],
        trim: true
      },
      currentValue: { type: Number, min: 0 }
    }],
    default: []
  },
  otherAssets: {
    type: [{
      type: {
        type: String,
        enum: ['property', 'investments', 'savings', 'other'],
        lowercase: true,
        trim: true
      },
      estimatedValue: { type: Number, min: 0 }
    }],
    default: []
  },

  // 4. SAVINGS GOALS
  savingsGoals: {
    type: [{
      name: { type: String, trim: true },
      targetAmount: { type: Number, min: 0 },
      currentAmount: { type: Number, min: 0 },
      category: {
        type: String,
        enum: ['travel', 'medical', 'gifts', 'other'],
        default: 'other',
        lowercase: true
      }
    }],
    default: []
  },

  // 5. LEGACY & PLANNING
  legacyPlanning: {
    beneficiaries: {
      type: [{
        name: { type: String },
        relationship: { type: String },
        percentage: { type: Number, min: 0, max: 100 }
      }],
      default: []
    }
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
retiredUserSchema.virtual('totalMonthlyIncome').get(function () {
  let total = 0;

  if (this.pension?.receives) {
    const { amount, frequency } = this.pension;
    const multiplier = {
      monthly: 1,
      quarterly: 1 / 3,
      'semi-annual': 1 / 6,
      annual: 1 / 12
    };
    total += (amount || 0) * (multiplier[frequency] || 1);
  }

  this.otherIncomeSources?.forEach(src => {
    const multiplier = {
      monthly: 1,
      quarterly: 1 / 3,
      'semi-annual': 1 / 6,
      annual: 1 / 12,
      occasional: 1 / 12
    };
    total += (src.amount || 0) * (multiplier[src.frequency] || 1);
  });

  this.retirementAccountWithdrawals?.forEach(acc => {
    total += acc.monthlyAmount || 0;
  });

  return parseFloat(total.toFixed(2));
});

retiredUserSchema.virtual('totalMonthlyExpenses').get(function () {
  let total = 0;

  if (this.housing) {
    total += this.housing.mortgageOrRent || 0;
    total += this.housing.insurance || 0;
    total += this.housing.maintenance || 0;
  }

  if (this.healthcare) {
    total += this.healthcare.monthlyPremium || 0;
    total += this.healthcare.outOfPocket || 0;
  }

  this.otherExpenses?.forEach(exp => {
    const multiplier = {
      monthly: 1,
      quarterly: 1 / 3,
      annual: 1 / 12
    };
    total += (exp.amount || 0) * (multiplier[exp.frequency] || 1);
  });

  return parseFloat(total.toFixed(2));
});

retiredUserSchema.virtual('safeWithdrawalRate').get(function () {
  const totalAssets = this.retirementAccounts?.reduce(
    (sum, acc) => sum + (acc.currentValue || 0),
    0
  ) || 0;

  if (totalAssets === 0) return 0;

  const annualGap = (this.totalMonthlyExpenses * 12) - (this.totalMonthlyIncome * 12);
  if (annualGap <= 0) return 0;

  return parseFloat(((annualGap / totalAssets) * 100).toFixed(2));
});

// Validation: Total beneficiary percentage ≤ 100%
retiredUserSchema.pre('save', function (next) {
  const beneficiaries = this.legacyPlanning?.beneficiaries;
  if (!beneficiaries || beneficiaries.length === 0) return next();

  const totalPercent = beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0);
  if (totalPercent > 100) {
    return next(new Error('Total beneficiary percentage cannot exceed 100%'));
  }
  next();
});

const Retired = mongoose.model('Retired', retiredUserSchema);
export default Retired;
