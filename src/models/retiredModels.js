
import mongoose from "mongoose";

const retiredSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    receivesPension: {type: Boolean, default: false},
    pensionAmount: {type: Number, default: 0},
    otherIncomeSources: {
        type: [String],
        default: []
    },
    totalMonthlyIncome: {type: Number, default: 0},
    averageExpenses: {
        type: [String],
        default: []
    },
    healthcareNeeds: {type: Boolean, default: false},
    healthcareExpenses: {type: Number, default: 0},
    financialResponsibilities: {
        type: [String],
        default: []
    },
    savingsGoals: {
        type: [String],
        default: []
    },
    summaryFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    customCategories: {
        type: [String],
        default: []
    },
    budgetLimits: {
        type: Map,
        of: Number,
        default: {}
    },
    createdAt: {type: Date, default: Date.now,},
    updatedAt: {type: Date, default: Date.now,},

})

const Retired = mongoose.model('Retired', retiredSchema);

export default Retired;