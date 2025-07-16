
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';
import cookieParser from "cookie-parser";
import db from "./src/db/connect.db.js";




dotenv.config({path: './.env'});
const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());



import indexRoute from './src/routes/indexRoute.js';
import userRoute from './src/routes/userRoute.js';



app.use('/', indexRoute);
app.use('/user', userRoute);



app.listen(port, () => {
    log(`⚡️[server]: Server is running at http://localhost:${port}`);
})

