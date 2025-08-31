import express from "express";
import { authenticateUser, authorizeRoles } from "../middelwares/authmiddelware";
import { instructorDashboard } from "../controllers/instractorcontroller";
import { createCourse } from "../controllers/coursecontroller"; //  import

const router = express.Router();

// Instructor Dashboard
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("instructor"),
  instructorDashboard
);

// Create Course
router.post(
  "/create-course",
  authenticateUser,
  authorizeRoles("instructor"),
  createCourse   // real wala controller
);

export default router;