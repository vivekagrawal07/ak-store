import express from 'express';
import { ProductModel, Product } from '../models/product.model';

const router = express.Router();

// Get all products
router.get('/', async (req, res, next) => {
  try {
    const products = await ProductModel.findAll();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Get product by ID
router.get('/:id', async (req, res, next) => {
  try {
    const product = await ProductModel.findById(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// Create product
router.post('/', async (req, res, next) => {
  try {
    const product: Product = req.body;
    const newProduct = await ProductModel.create(product);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
});

// Update product
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await ProductModel.update(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await ProductModel.delete(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export const productRoutes = router; 