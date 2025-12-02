import Blog from "../models/Blog.js";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js"; 
import { deleteFilesFromCloudinary } from "../utils/cloudinaryUpload.js";

// Upload optimized image like products
const uploadOptimizedImage = (buffer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const optimizedImage = await sharp(buffer)
        .resize(1200, null, { fit: "inside" })
        .toFormat("webp", { quality: 80 })
        .toBuffer();

      cloudinary.uploader.upload_stream(
        { folder: "blogs" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result.secure_url);
        }
      ).end(optimizedImage);
    } catch (error) {
      reject(error);
    }
  });
};

// ✅ Add new blog
export const addBlog = async (req, res) => {
  try {
    const { title, content, categories, tags } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Title & Content are required" });

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadOptimizedImage(file.buffer);
        images.push(url);
      }
    }

    const blog = await Blog.create({
      title,
      content,
      images,
       categories: JSON.parse(categories || "[]"),
      tags: JSON.parse(tags || "[]"), 
      createdBy: req.user,
      lastUpdatedBy: req.user,
    });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error("Add Blog Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Edit / Update Blog
export const editBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Existing Images from frontend
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = JSON.parse(req.body.existingImages);
    }

    let finalImages = [...existingImages];

    // New images upload
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadOptimizedImage(file.buffer);
        finalImages.push(url);
      }
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.images = finalImages;

   if (req.body.categories && typeof req.body.categories === "string") {
  blog.categories = req.body.categories.split(",").map(c => c.trim());
}

if (req.body.tags && typeof req.body.tags === "string") {
  blog.tags = req.body.tags.split(",").map(t => t.trim());
}


    blog.lastUpdatedBy = req.user;

    const updatedBlog = await blog.save();

    res.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error("Edit Blog Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Delete images
    if (blog.images.length > 0) {
      await deleteFilesFromCloudinary(blog.images, "blogs");
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Delete Blog Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get blog by id
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
