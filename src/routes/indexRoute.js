
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';

const router = express.Router();
dotenv.config({path: './.env'});

router.get('/', (req, res) => {
    res.render('index');
})

export default router;