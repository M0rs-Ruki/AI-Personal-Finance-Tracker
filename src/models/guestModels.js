
import mongoose from "mongoose";


const guestSchema = mongoose.Schema({
    fullName: { type: String, },
    email: { type: String, },
    password: { type: String, },
    phoneNumber: { type: String, },
    currency: {
        type: String,
        enum: ['INR', 'USD', 'EUR'],
        default: 'INR'
    },
    userType: { 
        type: String,
        enum: ['student', 'employed', 'unemployed', 'retired', 'guest'],
    },
    createdAt: {type: Date, default: Date.now,},
    updatedAt: {type: Date, default: Date.now,},
    
})


const Guest = mongoose.model('Guest', guestSchema);

export default Guest;