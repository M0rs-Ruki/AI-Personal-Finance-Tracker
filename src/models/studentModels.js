
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
    
})

const Student = mongoose.model('Student', studentSchema);

export default Student;