import express from "express";
import { registerUser, loginUser, getUsers, googleLogin, } from "../controllers/usercontroller"; 
import {upload} from "../middelwares/multermiddelware.ts"

const router = express.Router();

// Register new user
router.post("/registeruser", upload.single("image"),registerUser)

// Login with email/password
router.post("/loginuser", loginUser);

router.get("/fetchuser", getUsers);

router.post("/google-login", googleLogin);



export default router;