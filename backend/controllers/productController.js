import Product from "../models/Product.js";
import sharp from "sharp";
import { deleteFilesFromCloudinary } from "../utils/cloudinaryUpload.js";
import { v2 as cloudinary } from "cloudinary";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      stock,
      netExShowroomPrice,
      handlingCharge,
      rto,
      Insurance,
      onRoadePrice,
      sections,
      colors,
    } = req.body;

    const user = req.user;

    // 🔹 Group files by fieldname
    const filesByField = {};
    if (req.files) {
      req.files.forEach((file) => {
        if (!filesByField[file.fieldname]) {
          filesByField[file.fieldname] = [];
        }
        filesByField[file.fieldname].push(file);
      });
    }

    const parsedColors = JSON.parse(colors);

    const finalColors = [];

    for (const color of parsedColors) {
      const field = `colorImages_${color.index}`;
      const uploadedImages = [];

      if (filesByField[field]) {
        for (const file of filesByField[field]) {
          const optimized = await sharp(file.buffer)
            .resize(1200, null, { fit: "inside" })
            .toFormat("webp", { quality: 80 })
            .toBuffer();

          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "sokudo-products" }, (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
              })
              .end(optimized);
          });

          uploadedImages.push(uploadResult);
        }
      }

      finalColors.push({
        name: color.name,
        images: uploadedImages,
      });
    }

    const product = await Product.create({
      name,
      description,
      stock,
      netExShowroomPrice,
      handlingCharge,
      rto,
      Insurance,
      onRoadePrice,
      sections: JSON.parse(sections),
      colors: finalColors,
      createdBy: user,
      lastUpdatedBy: user,
    });

    return res.status(201).json({ success: true, product });
  } catch (err) {
    console.log("BACKEND ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      stock,
      netExShowroomPrice,
      handlingCharge,
      rto,
      Insurance,
      onRoadePrice,
      sections,
      colors,
    } = req.body;

    const user = req.user;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 🔹 Group files by fieldname (from multer.any())
    const filesByField = {};
    if (req.files) {
      req.files.forEach((file) => {
        if (!filesByField[file.fieldname]) {
          filesByField[file.fieldname] = [];
        }
        filesByField[file.fieldname].push(file);
      });
    }

    const parsedColors = JSON.parse(colors);
    const finalColors = [];

    for (const color of parsedColors) {
      const field = `colorImages_${color.index}`;

      let existingImages = color.existingImages || []; // already stored images
      let newImages = [];

      // If new images uploaded for this color
      if (filesByField[field]) {
        for (const file of filesByField[field]) {
          const optimized = await sharp(file.buffer)
            .resize(1200, null, { fit: "inside" })
            .toFormat("webp", { quality: 80 })
            .toBuffer();

          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ folder: "sokudo-products" }, (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
              })
              .end(optimized);
          });

          newImages.push(uploadResult);
        }
      }

      finalColors.push({
        name: color.name,
        images: [...existingImages, ...newImages], // keep old + new images
      });
    }

    // 🔥 Update product fields
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.stock = stock ?? product.stock;
    product.netExShowroomPrice =
      netExShowroomPrice ?? product.netExShowroomPrice;
    product.handlingCharge = handlingCharge ?? product.handlingCharge;
    product.rto = rto ?? product.rto;
    product.Insurance = Insurance ?? product.Insurance;
    product.onRoadePrice = onRoadePrice ?? product.onRoadePrice;
    product.sections = sections ? JSON.parse(sections) : product.sections;
    product.colors = finalColors;
    product.lastUpdatedBy = user;

    await product.save();

    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.log("BACKEND UPDATE ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    //  Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      await deleteFilesFromCloudinary(product.images, "sokudo-products");
    }

    await Product.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(" Error in deleteProduct:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
