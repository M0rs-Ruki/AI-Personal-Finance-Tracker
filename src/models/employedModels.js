
import mongoose from "mongoose";

const employerSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    jobTitle: { type: String, required: true, },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'self-employed'],
    },
    workIndustry: { type: String, required: true, },
    workLocation: { type: String, required: true, },
    monthlySalary: { type: Number, required: true, },
    additionalIncomeSources: {
        type: [String],
        default: []
    },
    hasBonuses: { type: Boolean, default: false, },
    customCategories: {
        type: [String],
        default: []
    },
    fixedExpenses: {
        type: Map,
        of: Number,
        default: {}
    },
    budgetLimits: {
        type: Map,
        of: Number,
        default: {}
    },
    savingsGoal: { type: Number, default: 0, },
    financialGoals: {
        type: [String],
        default: []
    },
    summaryFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    interestedInInvestments: { type: Boolean, default: false, },
    createdAt: { type: Date, default: Date.now, },
    updatedAt: { type: Date, default: Date.now, },

})

const Employer = mongoose.model('Employer', employerSchema);

export default Employer;