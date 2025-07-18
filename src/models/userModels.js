
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
        type: String,
    },
    notificationPreferences:{
        type: String,
        enum: ['email', 'sms', 'both'],
        default: 'email'
    },
    userType: {
        type: String,
        enum: ['student', 'employed', 'unemployed', 'retired', 'other'],
        default: 'other'
    },
    createdAt: {type: Date, default: Date.now,},
    
})


const User = mongoose.model('User', userSchema);

export default User;