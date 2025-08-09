
import express from "express";
import {log} from 'console';
import { RetiredPage } from "../controllers/retiredController.js";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";
import { StudentPage, UpdateStudentPage } from "../controllers/studentController.js";
import { EmployerPage } from "../controllers/employedController.js";
import { UnEmployedPage } from "../controllers/unEmployedController.js";


const router = express.Router();


router.post('/student',isLoggedIn, StudentPage);
router.post('/update-student', UpdateStudentPage);

router.post('/employed',isLoggedIn, EmployerPage );

router.post('/unemployed',isLoggedIn, UnEmployedPage);

router.post('/retired',isLoggedIn, RetiredPage);


export default router;