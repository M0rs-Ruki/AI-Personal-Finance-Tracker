
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';
import { registerUser, loginUser, logoutUser, GuestUser } from "../controllers/authController.js";

const router = express.Router();
dotenv.config({path: './.env'});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/guest', GuestUser);




export default router;

