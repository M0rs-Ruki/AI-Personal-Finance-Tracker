

import express from "express";
import { StudentDashboard, EmployerDashboard } from "../controllers/dashboardController.js";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";
import {log} from 'console';


const router = express.Router();

router.get('/student',isLoggedIn, StudentDashboard );
router.get('/employed',isLoggedIn, EmployerDashboard );


export default router;