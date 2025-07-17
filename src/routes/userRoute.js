
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';
import { registeUser, loginUser } from "../controllers/authController.js";

const router = express.Router();
dotenv.config({path: './.env'});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/signup', registeUser);
router.post('/login', loginUser);



export default router;

