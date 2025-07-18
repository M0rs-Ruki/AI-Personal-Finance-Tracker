
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';
import { registeUser, loginUser, logoutUser } from "../controllers/authController.js";
import isLoggedIn from "../middlewares/isLoggedInMiddleware.js";

const router = express.Router();
dotenv.config({path: './.env'});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/dashboard',isLoggedIn, (req, res) => {
    res.render('dashboard');
})


router.post('/signup', registeUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);



export default router;

