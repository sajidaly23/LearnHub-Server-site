import { Router } from "express";
import { createCourse, getCourse, updateCourse, listCourses } from "../controllers/coursecontriller";
import { authenticateUser } from "../middelwares/authmiddelware";

const router = Router();

router.post("/createCourse", authenticateUser, createCourse);
router.get("/getcourse", listCourses);
router.get("/getcourse:id", getCourse);
router.put("/:id", authenticateUser, updateCourse);

export default router;