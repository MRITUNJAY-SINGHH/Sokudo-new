import express from 'express';
import {
   getAllOrders,
   updateOrderStatus,
   getMyOrders,
   getOrderStats,
    getOrdersOverview,
    getOrderById,
    deleteOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User Route
router.get('/myorders', protect, getMyOrders);

// Admin Routes

router.get('/', protect, getAllOrders);
router.get('/stat', protect, getOrderStats);
router.get('/overview', protect, getOrdersOverview);
router.put('/:id', protect, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);
router.get('/:id', protect, getOrderById);

export default router;
