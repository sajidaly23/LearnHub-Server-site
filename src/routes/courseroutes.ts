import express from "express";
import { authenticateUser, authorizeRoles } from "../middelwares/authmiddelware";
import { uploadCourseFiles } from "../middelwares/multermiddelware.ts";
import { createCourse, listCourses, getCourse, updateCourse } from "../controllers/coursecontroller";

const router = express.Router();

//  Sirf Instructor ko allow karega
router.post(
  "/createCourse",
  authenticateUser,
  authorizeRoles("instructor"), //  yaha role restrict
  uploadCourseFiles,
  createCourse
);

router.get("/getcourse", listCourses);
router.get("/getcourse/:id", getCourse);
router.put("/:id", authenticateUser, updateCourse);

export default router;
