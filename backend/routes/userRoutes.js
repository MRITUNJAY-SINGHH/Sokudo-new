import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/userMiddleware.js";

const router = express.Router();

// Signup
router.post("/register", registerUser);

//login
router.post("/login", loginUser);

// Forgot 
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);

//Reset
router.put("/reset-password", resetPassword);

router.get("/me",protect, getUserProfile);
router.put("/update", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

export default router;


