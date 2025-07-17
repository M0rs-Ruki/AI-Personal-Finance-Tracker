

import bcrypt from 'bcrypt';


const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (err) {
        throw new Error('Error hashing password')
    }
}

const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
        throw new Error('Error comparing password')
    }
}



export { hashPassword, comparePassword }