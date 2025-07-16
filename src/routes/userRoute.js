
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';
import { registeUser } from "../controllers/authController.js";

const router = express.Router();
dotenv.config({path: './.env'});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', registeUser);


export default router;

