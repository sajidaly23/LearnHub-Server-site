import { Router } from "express";
import { googleLogin } from "../controllers/usercontroller";

const router = Router();

router.post("/google-login", googleLogin);

export default router;