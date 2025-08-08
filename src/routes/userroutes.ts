import express from "express";
import { register, loginUser } from "../controllers/usercontroller"; 
// 👆 yahan user.controller ka path aapke project ke structure ke hisaab se change karein

const router = express.Router();

// Register new user
router.post("/register", register);

// Login with email/password
router.post("/login", loginUser);

// (Optional) Google login route — agar add karna ho future me
// router.post("/login/google", googleLogin);

export default router;
