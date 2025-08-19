
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({path: './.env'});

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect
            (`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
        console.log(`MongoDB connected: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;