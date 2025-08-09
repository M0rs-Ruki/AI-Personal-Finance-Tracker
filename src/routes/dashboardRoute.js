

import express from "express";
import { GuestUserDashboard } from "../controllers/guestController.js";
import { StudentDashboard } from "../controllers/studentController.js";
import { EmployerDashboard } from "../controllers/employedController.js";
import { UnEmployedDashboard } from "../controllers/unEmployedController.js";
import { RetiredDashboard } from "../controllers/retiredController.js";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";
import {log} from 'console';


const router = express.Router();

router.get('/student',isLoggedIn, StudentDashboard );
router.get('/employed',isLoggedIn, EmployerDashboard );
router.get('/unemployed',isLoggedIn, UnEmployedDashboard );
router.get('/retired',isLoggedIn, RetiredDashboard );
router.post('/guest', GuestUserDashboard );



export default router;