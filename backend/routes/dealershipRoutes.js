import express from "express";
import {
  addDealership,
  getDealerships,
  getDealershipById,
  deleteDealership,
} from "../controllers/dealershipController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.post("/", addDealership); // Public - anyone can submit
router.get("/", protect, getDealerships); // Admin view
router.get("/:id", protect, getDealershipById);
router.delete("/:id", protect, deleteDealership);

export default router;
