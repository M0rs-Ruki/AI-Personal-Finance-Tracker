
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config({path: './.env'});

const generateToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
}

export default generateToken;