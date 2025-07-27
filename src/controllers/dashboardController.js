
import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import Employer from "../models/employedModels.js";
import UnEmployed from "../models/unemployedModels.js";
import Retired from "../models/retiredModels.js";
import GuestModel from "../models/guestUserModels.js";
import { log } from "console";


const StudentDashboard = async (req, res) => {
    try {
        res.send("Student Dashboard")
    } catch (err) {
        console.error("Error in StudentDashboard:", err);
        res.status(500).send("Something went wrong. Please try again later.");
    }
};

export { StudentDashboard };