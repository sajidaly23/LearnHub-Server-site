import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import userRoutes from "./routes/userroutes";
import { connectDB } from "./utils/connectDB";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000; 

app.use(express.json());

connectDB();
app.use(cors({
   origin: "http://localhost:3000", // Allow only this origin
  credentials: true,
}));
//routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});