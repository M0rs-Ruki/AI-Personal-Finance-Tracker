import FeedBack from "../models/feedbackModels.js";

// POST - Submit new feedback
const submitFeedback = async (req, res) => {
    try {
        const { name, email, feedback } = req.body;
        if (!name || !feedback) {
            return res.status(400).json({ message: "Name and feedback are required" });
        }
        
        const newFeedback = new FeedBack({ 
            name, 
            email, 
            message: feedback 
        });
        
        await newFeedback.save();
        
        // Send success response
        res.status(201).json({ 
            message: "Feedback submitted successfully!", 
            feedback: newFeedback 
        });
        
    } catch (err) {
        console.error("Error in submitFeedback:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// GET - Retrieve all feedback
const getFeedback = async (req, res) => {
    try {
        const feedback = await FeedBack.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(50); // Limit to 50 most recent
            
        res.status(200).json({
            message: "Feedback retrieved successfully",
            feedback
        });
        
    } catch (err) {
        console.error("Error in getFeedback:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export { submitFeedback, getFeedback };