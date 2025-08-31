import express from "express";
import { authenticateUser, authorizeRoles } from "../middelwares/authmiddelware";
import { studentDashboard } from "../controllers/studentcontroller"; // ✅ import

const router = express.Router();

// Student Dashboard
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("student"),
  studentDashboard   //  ab yahan controller use hoga
);

export default router;