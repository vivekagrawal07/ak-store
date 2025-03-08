import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';

const router = Router();

// Apply auth middleware to all product routes
router.use(auth);

// Product routes
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export const productRoutes = router; 