
import express from "express";
import dotenv from "dotenv";
import {log} from 'console';
import cookieParser from "cookie-parser";
import db from "./src/db/connect.db.js";
import bodyParser from "body-parser";
import qs from 'qs';



dotenv.config({path: './.env'});
const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/your-route', (req, res, next) => {
  if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
    req.body = qs.parse(req.body);
  }
  next();
});




import indexRoute from './src/routes/indexRoute.js';
import userRoute from './src/routes/userRoute.js';
import userTypeRoute from './src/routes/userTypeRoute.js';



app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/userType', userTypeRoute);



app.listen(port, () => {
    log(`⚡️[server]: Server is running at http://localhost:${port}`);
})

