import express from "express";
import { registerUser, loginUser,forgotPasswordAndSendOTP,  getUsers, googleLogin } from "../controllers/usercontroller"; 
import { uploadUserImage } from "../middelwares/multermiddelware.ts";
// import {authebticateUser} from "../middelwares/authmiddelware"

const router = express.Router();

// Register new user with profile image
router.post("/registeruser", uploadUserImage, registerUser);

// Login with email/password
router.post("/loginuser", loginUser);

router.post("/forgot-password", forgotPasswordAndSendOTP);

router.get("/fetchuser", getUsers);

router.post("/google-login", googleLogin);

export default router;
