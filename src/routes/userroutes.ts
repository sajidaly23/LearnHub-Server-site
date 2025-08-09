import express from "express";
import { register, loginUser, getUsers, } from "../controllers/usercontroller"; 
import {uploads} from "../middelwares/multermiddelware.ts"

const router = express.Router();

// Register new user
router.post("/registeruser", uploads.single("image"),register)

// Login with email/password
router.post("/loginuser", loginUser);
router.get("/fetchuser", getUsers);



export default router;