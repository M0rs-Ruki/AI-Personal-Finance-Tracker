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
  otherIncomeSources: [{
    source: { type: String, trim: true },
    amount: { type: Number, min: 0 },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'semi-annual', 'annual', 'occasional'],
      default: 'monthly'
    }
  }],
  retirementAccountWithdrawals: [{
    type: {
      type: String,
      enum: [
        'EPF (Employee Provident Fund)',
        'NPS (National Pension System)',
        'PPF (Public Provident Fund)',
        'Annuity (Pension Plans from Insurance Companies)',
        'Other'
      ],
      trim: true
    },
    monthlyAmount: { type: Number, min: 0 }
  }],

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
  otherExpenses: [{
    name: { type: String, trim: true },
    amount: { type: Number, min: 0 },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'annual'],
      default: 'monthly'
    }
  }],

  // 3. ASSETS
  retirementAccounts: [{
    type: {
      type: String,
      enum: [
        'EPF (Employee Provident Fund)',
        'NPS (National Pension System)',
        'PPF (Public Provident Fund)',
        'Annuity (Pension Plans from Insurance Companies)',
        'Other'
      ],
      trim: true
    },
    currentValue: { type: Number, min: 0 }
  }],

  // 4. SAVINGS GOALS
  savingsGoals: [{
    name: { type: String, trim: true },
    targetAmount: { type: Number, min: 0 },
    currentAmount: { type: Number, min: 0 },
    category: {
      type: String,
      enum: ['travel', 'medical', 'gifts', 'other'],
      default: 'other'
    }
  }],

  // 5. LEGACY & PLANNING
  legacyPlanning: {
    hasWill: { type: Boolean, default: false },
    hasEstatePlan: { type: Boolean, default: false },
    beneficiaries: [{
      name: String,
      relationship: String,
      percentage: { type: Number, min: 0, max: 100 }
    }]
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Virtual: Total Monthly Income
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

// ✅ Virtual: Total Monthly Expenses
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

// ✅ Virtual: Safe Withdrawal Rate
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

// ✅ Beneficiary percentage validation (should not exceed 100%)
retiredUserSchema.pre('save', function (next) {
  const beneficiaries = this.legacyPlanning?.beneficiaries;
  if (Array.isArray(beneficiaries) && beneficiaries.length > 0) {
    const totalPercent = beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0);
    if (totalPercent > 100) {
      return next(new Error('Total beneficiary percentage cannot exceed 100%'));
    }
  }
  next();
});

const Retired = mongoose.model('Retired', retiredUserSchema);
export default Retired;