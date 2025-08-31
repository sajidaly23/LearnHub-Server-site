import express from "express";
import { authenticateUser, authorizeRoles } from "../middelwares/authmiddelware";
import { adminDashboard } from "../controllers/admincontroller";

const router = express.Router();

// Admin dashboard with real stats
router.get("/dashboard", authenticateUser, authorizeRoles("admin"), adminDashboard);

router.get("/all-users", authenticateUser, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin can view all users (dummy API)", user: (req as any).user });
});

router.delete("/delete-user/:id", authenticateUser, authorizeRoles("admin"), (req, res) => {
  res.json({ message: `User with id ${req.params.id} deleted (dummy API)`, user: (req as any).user });
});

export default router;
