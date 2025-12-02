import express from 'express';
import { getInventory, updateInventoryStock } from '../controllers/inventoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getInventory); // get product stock
router.put('/update', protect, updateInventoryStock); // update stock manually

export default router;
