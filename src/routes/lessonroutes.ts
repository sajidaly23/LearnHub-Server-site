// routes/lessonroute.ts
import { Router } from "express";
import { createLesson, getLessonsByCourse } from "../controllers/lessoncontroller";
import { authenticateUser, authorizeRoles } from "../middelwares/authmiddelware";
import { upload } from "../middelwares/multermiddelware.ts"; // fixed import

const router = Router();

// Create lesson (only instructor/admin)
router.post(
  "/",
  authenticateUser,
  authorizeRoles("instructor", "admin"),
  upload.single("file"),
  createLesson
);

// Get lessons by course
router.get("/:courseId", getLessonsByCourse);

export default router;
