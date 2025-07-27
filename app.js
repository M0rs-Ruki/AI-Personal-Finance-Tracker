
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';
import cookieParser from "cookie-parser";
import db from "./src/db/connect.db.js";



dotenv.config({path: './.env'});

const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Uses qs internally
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(cookieParser());





import indexRoute from './src/routes/indexRoute.js';
import userRoute from './src/routes/userRoute.js';
import userTypeRoute from './src/routes/userTypeRoute.js';
import dashboardRoute from './src/routes/dashboardRoute.js';



app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/userType', userTypeRoute);
app.use('/dashboard', dashboardRoute);



app.listen(port, () => {
    log(`⚡️[server]: Server is running at http://localhost:${port}`);
})

