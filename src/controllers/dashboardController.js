
import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import Employer from "../models/employedModels.js";
import UnEmployed from "../models/unemployedModels.js";
import Retired from "../models/retiredModels.js";
import GuestModel from "../models/guestUserModels.js";
import { log } from "console";


const StudentDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send("User not found");
        };


        const student = await Student.findOne({ userId: user._id });
        if (!student) {
            return res.status(404).send("Student profile not found");
        };
        res.render("dashboards/student", { user, student });
        
    } catch (err) {
        console.error("Error in StudentDashboard:", err);
        res.status(500).send("Something went wrong.");
    }
};


export { StudentDashboard };