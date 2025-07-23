import mongoose from "mongoose";

const unEmployedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true, // Ensure one profile per user
    },
    employmentStatus: {
      type: String,
      enum: [
        "actively-seeking",
        "taking-break",
        "studying",
        "caring",
        "disabled",
      ],
      default: "actively-seeking",
    },
    lastJobDetails: {
      industry: { type: String, trim: true, maxlength: 100 },
      position: { type: String, trim: true, maxlength: 100 },
      duration: Number, // in months
    },
    currentIncome: {
      type: Number,
      min: 0,
      set: (value) => Math.round(value * 100) / 100,
    },
    incomeSources: [
      {
        sourceType: {
          type: String,
          enum: [
            "freelance",
            "government-aid",
            "family-support",
            "savings",
            "part-time",
            "other",
          ],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        frequency: {
          type: String,
          enum: [
            "daily",
            "weekly",
            "bi-weekly",
            "monthly",
            "quarterly",
            "annually",
            "irregular",
          ],
          default: "monthly",
        },
        description: {
          type: String,
          trim: true,
          maxlength: 200,
        },
      },
    ],

    debt: {
      amount: { type: Number, min: 0 },
      monthlyPayment: { type: Number, min: 0 },
      type: {
        type: String,
        enum: ["credit-card", "loan", "student-loan", "other"],
      },
    },
    
    comfortBudget: { type: Number, min: 0 }, 
    runwayEstimate: { type: Number, min: 0 },
    livingSituation: {
      type: String,
      enum: ["alone", "with-family", "with-roommates"],
    },
    hasDependents: { type: Boolean, default: false },
    dependentsCount: { type: Number, min: 0 },
    gigInterest: {
      type: String,
      enum: ["not-at-all", "somewhat", "very-open"],
      default: "somewhat",
    },
    hasTools: { type: Boolean, default: true },
    willingToRelocate: { type: Boolean, default: false },
    goalPriority: {
      type: String,
      enum: [
        "build-emergency-fund",
        "reduce-debt",
        "cover-rent",
        "invest-small",
        "learn-skill",
      ],
    },
    savingsDetails: {
      amount: { type: Number, min: 0, default: 0 },
      emergencyFund: { type: Number, min: 0 },
      monthsCovered: { type: Number, min: 0, max: 36 },
    },
    regularExpenses: [
      {
        category: { type: String, trim: true, maxlength: 50 },
        amount: { type: Number, min: 0 },
        frequency: {
          type: String,
          enum: ["daily", "weekly", "monthly", "quarterly", "annually"],
          default: "monthly",
        },
        essential: { type: Boolean, default: true },
      },
    ],
    budgetLimits: [
      {
        category: { type: String, trim: true, maxlength: 50 },
        limit: { type: Number, min: 0 },
        currentSpending: { type: Number, default: 0, min: 0 },
      },
    ],
    financialGoals: [
      {
        name: { type: String, trim: true, maxlength: 100 },
        type: {
          type: String,
          enum: [
            "emergency-fund",
            "debt-repayment",
            "job-search",
            "skill-development",
            "other",
          ],
          default: "job-search",
        },
        targetAmount: { type: Number, min: 0 },
        targetDate: Date,
        priority: {
          type: String,
          enum: ["critical", "high", "medium", "low"],
          default: "medium",
        },
        progress: { type: Number, min: 0, max: 100, default: 0 },
      },
    ],
    jobSearchDetails: {
      active: { type: Boolean, default: false },
      applicationsPerWeek: { type: Number, min: 0, max: 50 },
      jobSearchBudget: { type: Number, min: 0 },
      industriesTargeted: [String],
      skillsDevelopment: [String],
    },
    summaryFrequency: {
      type: String,
      enum: ["daily", "weekly", "bi-weekly", "monthly"],
      default: "weekly",
    },
    supportResources: {
      wantsBudgetHelp: { type: Boolean, default: false },
      wantsJobResources: { type: Boolean, default: false },
      wantsDebtAdvice: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
unEmployedSchema.virtual("totalMonthlyExpenses").get(function () {
  let total = 0;
  this.regularExpenses.forEach((exp) => {
    const a = exp.amount || 0;
    switch (exp.frequency) {
      case "daily":
        total += a * 30;
        break;
      case "weekly":
        total += a * 4.33;
        break;
      case "monthly":
        total += a;
        break;
      case "quarterly":
        total += a / 3;
        break;
      case "annually":
        total += a / 12;
        break;
    }
  });
  return parseFloat(total.toFixed(2));
});

unEmployedSchema.virtual("totalMonthlyIncome").get(function () {
  let total = this.currentIncome || 0;
  this.incomeSources.forEach((source) => {
    const a = source.amount || 0;
    switch (source.frequency) {
      case "daily":
        total += a * 30;
        break;
      case "weekly":
        total += a * 4.33;
        break;
      case "monthly":
        total += a;
        break;
      case "quarterly":
        total += a / 3;
        break;
      case "annually":
        total += a / 12;
        break;
    }
  });
  return parseFloat(total.toFixed(2));
});

unEmployedSchema.virtual("savingsCoverage").get(function () {
  if (this.totalMonthlyExpenses <= 0) return 0;
  return parseFloat(
    (this.savingsDetails.amount / this.totalMonthlyExpenses).toFixed(1)
  );
});

// Hooks
unEmployedSchema.pre("save", function (next) {
  if (this.savingsDetails.amount > 0 && this.totalMonthlyExpenses > 0) {
    this.savingsDetails.monthsCovered = parseFloat(
      (this.savingsDetails.amount / this.totalMonthlyExpenses).toFixed(1)
    );
  }
  next();
});

// Indexes
unEmployedSchema.index({
  "financialGoals.priority": 1,
  "financialGoals.targetDate": 1,
});
unEmployedSchema.index({ "jobSearchDetails.active": 1 });

const UnEmployed = mongoose.model("UnEmployed", unEmployedSchema);
export default UnEmployed;
