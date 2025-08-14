import { Router } from "express";
import { createCourse, getCourse, updateCourse, listCourses } from "../controllers/coursecontroller";
import { authenticateUser } from "../middelwares/authmiddelware";
import { upload } from "../middelwares/multermiddelware.ts"; // multer import

const router = Router();

// ✅ File + Data handle karne ke liye multer middleware lagao
router.post(
  "/createCourse",
  authenticateUser,
  upload.single("thumbnail"), // file field ka naam "thumbnail"
  createCourse
);

router.get("/getcourse", listCourses);
router.get("/getcourse/:id", getCourse);
router.put("/:id", authenticateUser, updateCourse);

export default router;
