import express from "express";
import { authenticateUser } from "../middelwares/authmiddelware";
import { uploadCourseFiles } from "../middelwares/multermiddelware.ts";
import { createCourse, listCourses, getCourse, updateCourse } from "../controllers/coursecontroller";

const router = express.Router();

router.post("/createCourse", authenticateUser, uploadCourseFiles, createCourse);
router.get("/getcourse", listCourses);
router.get("/getcourse/:id", getCourse);
router.put("/:id", authenticateUser, updateCourse);

export default router;
