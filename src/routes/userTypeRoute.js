
import express from "express";
import {log} from 'console';
import { EmployerPage, UnEmployedPage, RetiredPage } from "../controllers/userAuthController.js";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";
import { StudentPage, UpdateStudentPage } from "../controllers/studentController.js";


const router = express.Router();


router.post('/student',isLoggedIn, StudentPage);
router.post('/update-student',isLoggedIn, UpdateStudentPage);

router.post('/employed',isLoggedIn, EmployerPage);

router.post('/unemployed',isLoggedIn, UnEmployedPage);

router.post('/retired',isLoggedIn, RetiredPage);


export default router;