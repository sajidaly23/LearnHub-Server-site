import express from "express";
import { registerUser, loginUser, forgotPasswordAndSendOTP, getUsers, googleLogin } from "../controllers/usercontroller"; 
import { uploadUserImage } from "../middelwares/multermiddelware.ts";
import { authenticateUser, authorizeRoles } from "../middelwares/authmiddelware";

const router = express.Router();

// Register with image upload
router.post("/registeruser", uploadUserImage, registerUser);

// Login
router.post("/loginuser", loginUser);

// Forgot password
router.post("/forgot-password", forgotPasswordAndSendOTP);

//  Admin only - Get all users
router.get("/all-users", authenticateUser, authorizeRoles("admin"), getUsers);

// Google login
router.post("/google-login", googleLogin);

export default router;



// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   forgotPasswordAndSendOTP,
//   getUsers,
//   updateUser,
//   deleteUser,
//   getUserById,
//   deleteAllUsers,
//   googleLogin
// } from "../controllers/usercontroller";
// import { uploadUserImage } from "../middelwares/multermiddelware.ts";
// import { authenticateUser, authorizeRoles } from "../middelwares/authmiddelware";

// const router = express.Router();

// router.post("/registeruser", uploadUserImage, registerUser);
// router.post("/loginuser", loginUser);
// router.post("/forgot-password", forgotPasswordAndSendOTP);

// // Admin only
// router.get("/all-users", authenticateUser, authorizeRoles("admin"), getUsers);
// router.delete("/delete-all", authenticateUser, authorizeRoles("admin"), deleteAllUsers);

// // Google login
// router.post("/google-login", googleLogin);

// // user CRUD (protected where needed)
// router.get("/:id", authenticateUser, getUserById);
// router.put("/:id", authenticateUser, updateUser);
// router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteUser);

// export default router;
