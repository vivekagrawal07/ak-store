import express from 'express';
import { auth } from '../middleware/auth.middleware';
import { categoryController } from '../controllers/category.controller';

const router = express.Router();

// Get all categories
router.get('/', auth, categoryController.getAll);

// Get category by ID
router.get('/:id', auth, categoryController.getById);

// Create new category
router.post('/', auth, categoryController.create);

// Update category
router.put('/:id', auth, categoryController.update);

// Delete category
router.delete('/:id', auth, categoryController.delete);

export const categoryRoutes = router; 