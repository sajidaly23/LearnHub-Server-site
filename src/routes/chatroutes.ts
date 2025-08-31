import { Router } from "express";
import { sendMessage, getMessages, getThreads } from "../controllers/chatcontroller";

const router = Router();

router.post("/send", sendMessage);
router.get("/:courseId/with/:userId", getMessages);
router.get("/threads/:courseId", getThreads);

export default router;
