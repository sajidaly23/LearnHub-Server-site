import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import userRoutes from "./routes/userroutes";
import { connectDB } from "./utils/connectDB";
import courseRoutes from "./routes/courseroutes";
import lessonRoutes from "./routes/lessonroutes"; 
import paymentRoutes from "./routes/paymentroutes";
import { OAuth2Client } from "google-auth-library";
import authRoutes from "./routes/authroutes";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();
const PORT = process.env.PORT || 5000; 

//  JSON & Form-data parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Connect DB
connectDB();

app.use(cors({
  origin: "*", // Allow all origins
  credentials: true,
}));

//  Routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
