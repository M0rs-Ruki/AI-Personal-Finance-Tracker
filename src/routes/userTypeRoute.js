
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';
import { StudentPage,
    EmployerPage,
    UnEmployedPage,
 } from "../controllers/userAuthController.js";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";


const router = express.Router();
dotenv.config({path: './.env'});


router.post('/student',isLoggedIn, StudentPage);
router.post('/employed',isLoggedIn, EmployerPage);
router.post('/unemployed',UnEmployedPage);


export default router;