
import User from "../models/userModels.js";
import Student from "../models/studentModels.js";
import Employer from "../models/employedModels.js";
import UnEmployed from "../models/unemployedModels.js";
import Retired from "../models/retiredModels.js";
import { log } from "console";


const dashboardPage = async (req, res) => {
    try {
        
        const user = await User.findById(req.user._id).lean();
        // log(user);
        if (!user) {
            return res.status(404).render('dashboard', user)
        }

        

    } catch (err) {
        console.error("Error during dashboard page:", err);
        res.status(500).send("Internal Server Error");
        
    }
};


export { dashboardPage };