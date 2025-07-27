

import express from "express";
import { StudentDashboard } from "../controllers/dashboardController.js";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";
import {log} from 'console';


const router = express.Router();

router.get('/student',isLoggedIn, StudentDashboard );


export default router;