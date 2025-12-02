import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  addBlog,
  editBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
} from "../controllers/blogController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post("/", protect, upload.array("images", 5), addBlog);
router.put("/:id", protect, upload.array("images", 5), editBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
