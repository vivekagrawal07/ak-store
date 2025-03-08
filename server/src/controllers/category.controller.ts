import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { OkPacket, RowDataPacket } from 'mysql2';

interface Category extends RowDataPacket {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export const categoryController = {
  // Get all categories
  getAll: async (req: Request, res: Response) => {
    try {
      const [categories] = await db.query<Category[]>('SELECT * FROM categories ORDER BY name');
      res.json(categories);
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({ message: 'Error getting categories' });
    }
  },

  // Get category by ID
  getById: async (req: Request, res: Response) => {
    try {
      const [categories] = await db.query<Category[]>('SELECT * FROM categories WHERE id = ?', [req.params.id]);
      
      if (categories.length === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json(categories[0]);
    } catch (error) {
      console.error('Error getting category:', error);
      res.status(500).json({ message: 'Error getting category' });
    }
  },

  // Create new category
  create: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }

      const id = uuidv4();
      const [result] = await db.query<OkPacket>(
        'INSERT INTO categories (id, name) VALUES (?, ?)',
        [id, name]
      );

      if (result.affectedRows === 1) {
        const [categories] = await db.query<Category[]>('SELECT * FROM categories WHERE id = ?', [id]);
        res.status(201).json(categories[0]);
      } else {
        res.status(500).json({ message: 'Error creating category' });
      }
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Category name already exists' });
      }
      console.error('Error creating category:', error);
      res.status(500).json({ message: 'Error creating category' });
    }
  },

  // Update category
  update: async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const { id } = req.params;

      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }

      const [result] = await db.query<OkPacket>(
        'UPDATE categories SET name = ? WHERE id = ?',
        [name, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const [categories] = await db.query<Category[]>('SELECT * FROM categories WHERE id = ?', [id]);
      res.json(categories[0]);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Category name already exists' });
      }
      console.error('Error updating category:', error);
      res.status(500).json({ message: 'Error updating category' });
    }
  },

  // Delete category
  delete: async (req: Request, res: Response) => {
    try {
      const [result] = await db.query<OkPacket>('DELETE FROM categories WHERE id = ?', [req.params.id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ message: 'Error deleting category' });
    }
  }
}; 