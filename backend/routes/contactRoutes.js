import express from "express";
import {
  addContact,
  getContacts,
  getContactById,
  deleteContact,
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", addContact);

// Admin-only routes (protected)
router.get("/", protect, getContacts);
router.get("/:id", protect, getContactById);
router.delete("/:id", protect, deleteContact);

export default router;
