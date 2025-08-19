import mongoose from "mongoose";

const feedBackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isPublic: {
        type: Boolean,
        default: true // Add this if you want to control visibility
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
});

const FeedBack = mongoose.model('FeedBack', feedBackSchema);
export default FeedBack;