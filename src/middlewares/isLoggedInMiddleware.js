
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {log} from 'console';
import User from "../models/userModels.js";


dotenv.config({path: './.env'});

const isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/user/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User
        .findOne({email: decoded.email})
        .select('-password');
        if (!user) {
            return res.redirect('/user/login');
        }
        req.user = user;
        next();

    } catch (err) {
        req.redirect('/user/login');
        console.log(err, 'Error in isLoggedIn');
    }
}


export default isLoggedIn;