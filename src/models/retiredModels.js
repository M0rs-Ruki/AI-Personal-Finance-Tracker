import mongoose from "mongoose";

const retiredSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  retirementDate: {
    type: Date,
  },
  pensionDetails: {
    receivesPension: {
      type: Boolean,
      default: false
    },
    sources: [{
      name: {
        type: String,
        trim: true,
        maxlength: 100
      },
      amount: {
        type: Number,
        min: 0
      },
      frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'semi-annual', 'annual'],
        default: 'monthly'
      },
      taxable: {
        type: Boolean,
        default: true
      }
    }]
  },
  retirementAccounts: [{
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    type: {
      type: String,
      enum: ['401k', 'IRA', 'Roth IRA', 'pension', 'annuity', 'brokerage', 'other'],
      required: true
    },
    currentValue: {
      type: Number,
      min: 0,
      required: true
    },
    withdrawalRate: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  otherIncomeSources: [{
    source: {
      type: String,
      trim: true,
      maxlength: 100
    },
    amount: {
      type: Number,
      min: 0,
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'semi-annual', 'annual', 'occasional'],
      default: 'monthly'
    }
  }],
  healthcareDetails: {
    hasCoverage: {
      type: Boolean,
      default: false
    },
    monthlyPremium: {
      type: Number,
      min: 0,
      default: 0
    },
    outOfPocketMax: {
      type: Number,
      min: 0
    },
    estimatedAnnualExpenses: {
      type: Number,
      min: 0
    },
    longTermCareCoverage: {
      type: Boolean,
      default: false
    }
  },
  livingSituation: {
    type: String,
    enum: ['own-home', 'renting', 'retirement-community', 'with-family', 'assisted-living'],
    default: 'own-home'
  },
  housingExpenses: {
    mortgageOrRent: {
      type: Number,
      min: 0
    },
    propertyTax: {
      type: Number,
      min: 0
    },
    homeInsurance: {
      type: Number,
      min: 0
    },
    maintenance: {
      type: Number,
      min: 0
    }
  },
  financialResponsibilities: [{
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    amount: {
      type: Number,
      min: 0,
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'annual', 'one-time'],
      default: 'monthly'
    },
    endDate: Date,
    description: {
      type: String,
      trim: true,
      maxlength: 200
    }
  }],
  savingsGoals: [{
    name: {
      type: String,
      trim: true,
      maxlength: 100
    },
    targetAmount: {
      type: Number,
      min: 0,
    },
    currentAmount: {
      type: Number,
      min: 0,
      default: 0
    },
    targetDate: Date,
    priority: {
      type: String,
      enum: ['essential', 'important', 'discretionary'],
      default: 'important'
    }
  }],
  legacyPlanning: {
    hasEstatePlan: {
      type: Boolean,
      default: false
    },
    hasWill: {
      type: Boolean,
      default: false
    },
    beneficiaries: [{
      name: String,
      relationship: String,
      percentage: Number
    }]
  },
  summaryFrequency: {
    type: String,
    enum: ['weekly', 'bi-weekly', 'monthly', 'quarterly'],
    default: 'monthly'
  },
  budgetPreferences: {
    travelBudget: {
      type: Number,
      min: 0
    },
    leisureBudget: {
      type: Number,
      min: 0
    },
    healthcareBudget: {
      type: Number,
      min: 0
    },
    giftingBudget: {
      type: Number,
      min: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total monthly income
retiredSchema.virtual('totalMonthlyIncome').get(function() {
  let total = 0;
  
  // Pension income
  this.pensionDetails.sources.forEach(pension => {
    if (pension.frequency === 'monthly') {
      total += pension.amount || 0;
    } else if (pension.frequency === 'quarterly') {
      total += (pension.amount || 0) / 3;
    } else if (pension.frequency === 'semi-annual') {
      total += (pension.amount || 0) / 6;
    } else if (pension.frequency === 'annual') {
      total += (pension.amount || 0) / 12;
    }
  });
  
  // Other income sources
  this.otherIncomeSources.forEach(source => {
    if (source.frequency === 'monthly') {
      total += source.amount || 0;
    } else if (source.frequency === 'quarterly') {
      total += (source.amount || 0) / 3;
    } else if (source.frequency === 'semi-annual') {
      total += (source.amount || 0) / 6;
    } else if (source.frequency === 'annual') {
      total += (source.amount || 0) / 12;
    } else if (source.frequency === 'occasional') {
      // Average occasional income as monthly
      total += (source.amount || 0) / 12;
    }
  });
  
  // Withdrawals from retirement accounts
  this.retirementAccounts.forEach(account => {
    if (account.withdrawalRate && account.currentValue) {
      const annualWithdrawal = account.currentValue * (account.withdrawalRate / 100);
      total += annualWithdrawal / 12;
    }
  });
  
  return parseFloat(total.toFixed(2));
});

// Virtual for total monthly expenses
retiredSchema.virtual('totalMonthlyExpenses').get(function() {
  let total = 0;
  
  // Housing expenses
  if (this.housingExpenses) {
    total += this.housingExpenses.mortgageOrRent || 0;
    total += (this.housingExpenses.propertyTax || 0) / 12;
    total += this.housingExpenses.homeInsurance || 0;
    total += this.housingExpenses.maintenance || 0;
  }
  
  // Healthcare expenses
  if (this.healthcareDetails) {
    total += this.healthcareDetails.monthlyPremium || 0;
    total += (this.healthcareDetails.estimatedAnnualExpenses || 0) / 12;
  }
  
  // Financial responsibilities
  this.financialResponsibilities.forEach(resp => {
    if (resp.frequency === 'monthly') {
      total += resp.amount || 0;
    } else if (resp.frequency === 'quarterly') {
      total += (resp.amount || 0) / 3;
    } else if (resp.frequency === 'annual') {
      total += (resp.amount || 0) / 12;
    }
  });
  
  return parseFloat(total.toFixed(2));
});

// Virtual for safe withdrawal rate
retiredSchema.virtual('safeWithdrawalRate').get(function() {
  const totalAssets = this.retirementAccounts.reduce((sum, account) => 
    sum + (account.currentValue || 0), 0);
  
  if (totalAssets <= 0) return 0;
  
  const annualIncomeNeeded = (this.totalMonthlyExpenses * 12) - (this.totalMonthlyIncome * 12);
  if (annualIncomeNeeded <= 0) return 0;
  
  return parseFloat(((annualIncomeNeeded / totalAssets) * 100).toFixed(2));
});

// Indexes
retiredSchema.index({ retirementDate: 1 });
retiredSchema.index({ 'savingsGoals.priority': 1, 'savingsGoals.targetDate': 1 });
retiredSchema.index({ 'healthcareDetails.hasCoverage': 1 });

// Pre-save hook to update legacy planning status
retiredSchema.pre('save', function(next) {
  if (this.legacyPlanning.hasWill || this.legacyPlanning.hasEstatePlan) {
    this.legacyPlanning.isPlanned = true;
  } else {
    this.legacyPlanning.isPlanned = false;
  }
  next();
});

const Retired = mongoose.model('Retired', retiredSchema);

export default Retired;