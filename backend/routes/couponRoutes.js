import express from "express";
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { protect } from "../middleware/userMiddleware.js";

const router = express.Router();

// Routes with authentication
router.post("/", protect, createCoupon); // Add new coupon
router.get("/", protect, getCoupons); // Get all coupons
router.get("/:id", protect, getCouponById); // Get single coupon
router.put("/:id", protect, updateCoupon); // Update coupon
router.delete("/:id", protect, deleteCoupon); // Delete coupon

export default router;
