
import User from "../models/userModels.js";
import {log} from 'console';
import generateToken from "../utils/generateTokenUtlis.js";
import { hashPassword, comparePassword, } from "../utils/bcryptPasswordUtlis.js";


const registeUser = async ( req, res ) => {
    try {
        const { fullName , email, password, phoneNumber,
            currency, monthlyIncome, budgetGoals, 
            notificationPreferences
        } =  req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'User Name and Email and Password  are required fields are missing' });
        }

        const passwordHash = await hashPassword(password);

        const newUser = new User({
            fullName,
            email,
            password: passwordHash,
            phoneNumber,
            currency,
            monthlyIncome,
            budgetGoals,
            notificationPreferences
        });

        await newUser.save();
        const token = generateToken(newUser);
        res.cookie('token', token );
        res.redirect('/dashboard');

    } catch (err) {
        res.status(500).json({ message: ' Error operating during register user ' });
    }
}


const loginUser = async ( req, res ) => {
    try {
        const { email, password, phoneNumber } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required fields are missing' });
        }

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
            res.redirect('/login');
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = generateToken(user);
        res.cookie('token', token);
        res.redirect('/dashboard');

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: ' Error operating during login user ' });
    }
}


const logoutUser = async ( req, res ) => {
    try {
        res.clearCookie('token');
        res.redirect('/');
    } catch (err) {
        res.status(500).json({ message: ' Error operating during logout user ' });
    }
}

export { registeUser, loginUser, logoutUser }