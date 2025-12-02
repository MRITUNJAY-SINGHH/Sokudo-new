import Product from '../models/Product.js';

// 1️⃣ Get all products with stock
export const getInventory = async (req, res) => {
  try {
    const products = await Product.find({}, 'name stock');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2️⃣ Update stock manually
export const updateInventoryStock = async (req, res) => {
  try {
    const { productId, quantityChange } = req.body; // +ve to add, -ve to reduce

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.stock += quantityChange;
    if (product.stock < 0) product.stock = 0;

    await product.save();
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
