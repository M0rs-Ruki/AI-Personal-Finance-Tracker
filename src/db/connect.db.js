
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({path: './.env'});

mongoose
.connect(process.env.MONGO_URI)
.then(() => {console.log(' Mongodb connected successfully ')})
.catch((err) => {console.log("Error connecting to MongoDB:", err)});

const db = mongoose.connection;

export default db;