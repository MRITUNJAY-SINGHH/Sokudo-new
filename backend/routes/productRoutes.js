import express from 'express';
import multer from 'multer';
import {
   addProduct,
   getProducts,
   getProductById,
   updateProduct,
   deleteProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, upload.any(), addProduct);
router.put('/:id', protect, upload.any(), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
