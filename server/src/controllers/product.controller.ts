import { Request, Response } from 'express';
import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2';

interface Product extends RowDataPacket {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  created_at?: Date;
  updated_at?: Date;
}

interface CountResult extends RowDataPacket {
  count: number;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let query = 'SELECT * FROM products';
    let countQuery = 'SELECT COUNT(*) as count FROM products';
    const params: any[] = [];
    const countParams: any[] = [];

    if (search || category) {
      const conditions: string[] = [];
      if (search) {
        conditions.push('name LIKE ?');
        params.push(`%${search}%`);
        countParams.push(`%${search}%`);
      }
      if (category) {
        conditions.push('category = ?');
        params.push(category);
        countParams.push(category);
      }
      const whereClause = conditions.join(' AND ');
      query += ` WHERE ${whereClause}`;
      countQuery += ` WHERE ${whereClause}`;
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [[countResult]] = await db.query<CountResult[]>(countQuery, countParams);
    const [products] = await db.query<Product[]>(query, params);

    res.json({
      data: products,
      total: countResult.count,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ message: 'Error getting products', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [products] = await db.query<Product[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ message: 'Error getting product', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, quantity, price } = req.body;

    if (!name || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const id = uuidv4();
    await db.query(
      'INSERT INTO products (id, name, category, quantity, price) VALUES (?, ?, ?, ?, ?)',
      [id, name, category, quantity, price]
    );

    const [products] = await db.query<Product[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    res.status(201).json(products[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const [products] = await db.query<Product[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateFields = Object.keys(updates)
      .filter(key => ['name', 'category', 'quantity', 'price'].includes(key))
      .map(key => `${key} = ?`);

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const query = `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`;
    const values = [...Object.values(updates), id];

    await db.query(query, values);

    const [updatedProducts] = await db.query<Product[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    res.json(updatedProducts[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [products] = await db.query<Product[]>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [id]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}; 