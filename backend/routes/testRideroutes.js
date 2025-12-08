import express from "express";
import {
  createTestRide,
  getMyTestRides,
  getAllTestRides
} from "../controllers/testRideController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Simple booking – NO payment
router.post("/book", createTestRide);

// Logged-in user's test rides
router.get("/my-test-rides", protect, getMyTestRides);

router.get("/",  getAllTestRides);

export default router;
