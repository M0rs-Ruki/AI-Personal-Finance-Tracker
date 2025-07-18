
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';


const router = express.Router();
dotenv.config({path: './.env'});

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/how-it-works', (req, res) => {
    res.render('how-it-works');
})

router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/features', (req, res) => {
    res.render('features');
})



export default router;