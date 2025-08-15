import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import userRoutes from "./routes/userroutes";
import { connectDB } from "./utils/connectDB";
import courseRoutes from "./routes/courseroutes";
import lessonRoutes from "./routes/lessonroutes"; 
import { OAuth2Client } from "google-auth-library";
import authRoutes from "./routes/authroutes";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Server start hone se pehle uploads folders bana lo
const folders = [
  "uploads/images",
  "uploads/documents",
  "uploads/videos",
  "uploads/userimages"
];
folders.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📂 Folder created: ${dir}`);
  }
});

const app = express();
const PORT = process.env.PORT || 6000; 

app.use(express.json());

// Connect DB
connectDB();

app.use(cors({
  origin: "*", // Allow all origins
  credentials: true,
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
