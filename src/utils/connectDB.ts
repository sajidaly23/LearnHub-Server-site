import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBURI = process.env.MONGODB_URI as string;

export const connectDB = async () => {
    try {
        await mongoose.connect(DBURI);
        console.log(" Connected to database");
    } catch (error) {
        console.error("Error connecting to database:", error);
         process.exit(1);
    }
};