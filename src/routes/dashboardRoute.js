

import express from "express";
import { StudentDashboard, EmployerDashboard,
    UnEmployedDashboard, RetiredDashboard,
} from "../controllers/dashboardController.js";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";
import {log} from 'console';


const router = express.Router();

router.get('/student',isLoggedIn, StudentDashboard );
router.get('/employed',isLoggedIn, EmployerDashboard );
router.get('/unemployed',isLoggedIn, UnEmployedDashboard );
router.get('/retired',isLoggedIn, RetiredDashboard );



export default router;