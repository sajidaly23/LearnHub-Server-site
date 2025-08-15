import { Router } from "express";
import { createLesson, getLessonsByCourse, updateLesson, deleteLesson } from "../controllers/lessoncontroller";
import { authenticateUser } from "../middelwares/authmiddelware";

const router = Router();

// Create lesson
router.post("/createLesson", authenticateUser, createLesson);

// Get lessons by course
router.get("/:courseId", getLessonsByCourse);

// Update lesson
router.put("/:id", authenticateUser, updateLesson);

// Delete lesson
router.delete("/:id", authenticateUser, deleteLesson);

export default router;