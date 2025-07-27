
import express from "express";
import {log} from 'console';
import { StudentPage,
    EmployerPage,
    UnEmployedPage,
    RetiredPage,
    GuestUserPage,
 } from "../controllers/userAuthController.js";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";


const router = express.Router();


router.post('/student',isLoggedIn, StudentPage);
router.post('/employed',isLoggedIn, EmployerPage);
router.post('/unemployed',isLoggedIn, UnEmployedPage);
router.post('/retired',isLoggedIn, RetiredPage);
router.post('/guest', GuestUserPage);


export default router;