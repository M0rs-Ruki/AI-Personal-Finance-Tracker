
import User from "../models/userModels.js";


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

        const newUser = new User({
            fullName,
            email,
            password,
            phoneNumber,
            currency,
            monthlyIncome,
            budgetGoals,
            notificationPreferences
        });
        await newUser.save();
        // console.log(newUser);
        
        res.redirect('/')

    } catch (err) {
        res.status(500).json({ message: ' Error operating during register user ' });
    }
}

export { registeUser }