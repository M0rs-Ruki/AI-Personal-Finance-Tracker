
import mongoose from "mongoose";


const guestSchema = mongoose.Schema({
    fullName: { type: String, },
    email: { type: String, unique: true, },
    password: { type: String, },
    phoneNumber: { type: String, },
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
        enum: ['student', 'employed', 'unemployed', 'retired', 'guest'],
    },
    createdAt: {type: Date, default: Date.now,},
    updatedAt: {type: Date, default: Date.now,},
    
})


const GuestUser = mongoose.model('GuestUser', guestSchema);

export default GuestUser;