
import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    educationLevel: {
        type: String,
        enum: ['school', 'college', 'university', 'other'],
    },
    livingSituation: {
        type: String,
        enum: ['hostel', 'family','rental','PG','other'],
    },
    monthlyAllowance: {type: String},
    isParentFunded: {
        type: String,
        enum: ['yes', 'no', 'partially']
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
    savingsGoal: {
        type: Number,
        default: 0
    },
    financialGoals: {
        type: [String],
        default: []
    },
    summaryFrequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    createdAt: {type: Date, default: Date.now,},
        
})

const Student = mongoose.model('Student', studentSchema);

export default Student;