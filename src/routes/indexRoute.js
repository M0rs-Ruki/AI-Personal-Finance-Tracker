
import express from "express";
import {log} from 'console';


const router = express.Router();

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

router.get('/contact', (req, res) => {
    res.render('contact');
})


export default router;