import express from 'express';
import {
   createOrder,
   verifyPayment,
   handleFailedPayment,
   getAllTransactions,
   getTransactionById,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/failure', protect, handleFailedPayment);

router.get('/',  getAllTransactions);

// ✅ GET transaction by ID
router.get('/:id', getTransactionById);

export default router;
