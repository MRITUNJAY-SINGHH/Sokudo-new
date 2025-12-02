import express from 'express';
import multer from 'multer';
import {
   addCareer,
   getCareers,
   getCareerById,
   deleteCareer,
} from '../controllers/careerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// 🔹 Routes
router.post('/', upload.single('cv'), addCareer);
router.get('/', protect, getCareers);
router.get('/:id', protect, getCareerById);
router.delete('/:id', protect, deleteCareer);

export default router;
