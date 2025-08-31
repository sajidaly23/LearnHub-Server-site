// routes/enrollmentroutes.ts
import { Router } from "express";
import {
 createEnrollment,
  getAllEnrollments,
  getStudentEnrollments,
  checkEnrollment,
  deleteEnrollment,
} from "../controllers/Enrollmentcontroller";
import { authenticateUser, authorizeRoles } from "../middelwares/authmiddelware";

const router = Router();

//  Student enroll
router.post("/enroll", authenticateUser, authorizeRoles("student"), createEnrollment);

//  Admin: all enrollments
router.get("/enroll", authenticateUser, authorizeRoles("admin"), getAllEnrollments);

//  Student: apne enrollments
router.get("/student/:studentId", authenticateUser, authorizeRoles("student"), getStudentEnrollments);

//  Student: check enrollment in a course
router.get("/check/:studentId/:courseId", authenticateUser, authorizeRoles("student"), checkEnrollment);

//  Delete enrollment (Student or Admin both allowed)
router.delete("/:enrollmentId", authenticateUser, deleteEnrollment);

export default router;
