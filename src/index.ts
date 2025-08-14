import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import userRoutes from "./routes/userroutes";
import { connectDB } from "./utils/connectDB";
import courseRoutes from "./routes/courseroutes"
import { OAuth2Client } from "google-auth-library";

import authRoutes from "./routes/authroutes";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000; 

app.use(express.json());

connectDB();
app.use(cors({
   origin: "*", // Allow all this origin
  credentials: true,
}));
//routes
app.use("/api/users", userRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});