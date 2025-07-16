
import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'INR'
    },
    monthlyIncome: {
        type: Number,
    },
    budgetGoals: [
        {
            food: {type: Number},
            rent: {type: Number},
            travel: {type: Number},
        }
    ],
    notificationPreferences:{
        type: String,
        enum: ['email', 'sms', 'both'],
        default: 'email'
    },
    createdAt: {type: Date, default: Date.now,},
    updatedAt: {type: Date, default: Date.now,}
    
})


const User = mongoose.model('User', userSchema);

export default User;