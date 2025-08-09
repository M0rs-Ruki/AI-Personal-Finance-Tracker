
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/connect.db.js";
import {log} from 'console';

dotenv.config({path: './.env'});
const app = express();

// Database connexion 
connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        log(`⚡️[server]: Server is running at http://localhost:${process.env.PORT}`);
    });
    app.on("error", (err) => {
        log(`⚡️[server]: Server error: ${err}`)
    })
})
.catch((err) => log(`MONGODB ERROR: ${err}`))



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(cookieParser());



// Routes
import indexRoute from './src/routes/indexRoute.js';
import userRoute from './src/routes/userRoute.js';
import userTypeRoute from './src/routes/userTypeRoute.js';
import dashboardRoute from './src/routes/dashboardRoute.js';

app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/userType', userTypeRoute);
app.use('/dashboard', dashboardRoute);



