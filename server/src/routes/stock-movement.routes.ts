import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { stockMovementController } from '../controllers/stock-movement.controller';

const router = express.Router();

// Get all stock movements
router.get('/', auth, stockMovementController.getAll);

// Create new stock movement
router.post('/', auth, stockMovementController.create);

export const stockMovementRoutes = router; 