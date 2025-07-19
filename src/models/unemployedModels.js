
import mongoose from "mongoose";

const unEmployedSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    activelySeekingJob: {type: Boolean, default: false},
    currentIncome: {type: Number, required: true},
    incomeSources: {
        type: String,
        enum: ["freelance", "government aid", "family support"],
        default: "family support"
    },
    receivingSupportFrom: {
        type: String,
        enum: ["family", "friends", "government"],
        default: "family"
    },
    savingsAmount: {type: Number, default: 0},
    regularExpenses: {
        type: [String],
        default: []
    },
    customCategories: {
        type: [String]
    },
    budgetLimits: {
        type: Map,
        of: Number,
        default: {}
    },
    financialGoals: {
        type: [String],
        default: []
    },
    wantsBudgetHelp: {type: Boolean, default: false},
    summaryFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    createdAt: {type: Date, default: Date.now,},
    updatedAt: {type: Date, default: Date.now,},

})

const UnEmployed = mongoose.model('UnEmployed', unEmployedSchema);

export default UnEmployed;
