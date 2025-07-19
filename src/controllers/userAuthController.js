
import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import Employer from "../models/employedModels.js";
import UnEmployed from "../models/unemployedModels.js";
import Retired from "../models/retiredModels.js";
import {log} from 'console';


const StudentPage = async (req, res) => {
    try {

        const { userId, educationLevel,
            institutionName, livingSituation,
            monthlyAllowance, isParentFunded,
            customCategories, financialGoals,
            summaryFrequency 
        } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // log(userId)
        const newStudent = new Student({
            userId,
            educationLevel: req.body.education,
            institutionName: req.body.institution,
            livingSituation: req.body.accommodation,
            monthlyAllowance: req.body.allowance,
            isParentFunded: req.body.funding,
            customCategories,
            financialGoals,
            summaryFrequency 
        })
        await newStudent.save();
        res.redirect('/user/deshboard');

    } catch (err) {
        console.error('Error during student page:', err);
    }
}


export { StudentPage }


