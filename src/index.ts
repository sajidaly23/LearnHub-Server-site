

import express from "express";
import cors from "cors";
import { createServer } from "http";

import { connectDB } from "./utils/connectDB";
import { initSocket } from "./sockets/chatsocket";

// routes
import userRoutes from "./routes/userroutes";
import courseRoutes from "./routes/courseroutes";
import lessonRoutes from "./routes/lessonroutes";
import paymentRoutes from "./routes/paymentroutes";
import authRoutes from "./routes/authroutes";
import studentRoutes from "./routes/studentroutes";
import instructorRoutes from "./routes/instructorRoutes";
import adminRoutes from "./routes/adminroutes";
import enrollmentRoutes from "./routes/enrollementroutes";
import chatRoutes from "./routes/chatroutes";


dotenv.config();
import dotenv from "dotenv";

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

// connect DB
connectDB();

// main routes
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/payment", paymentRoutes);

// role-based routes
app.use("/api/student", studentRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/admin", adminRoutes);


// sabse pehle webhook route add karo
app.use("/api/payment", paymentRoutes);

// chat routes
app.use("/api/chat", chatRoutes);

// create server + socket
const server = createServer(app);
initSocket(server);

// start server
server.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
