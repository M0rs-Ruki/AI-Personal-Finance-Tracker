
import express from "express";
import {log} from 'console';
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { GuestUser } from "../controllers/guestController.js";

const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/guest', GuestUser);




export default router;

