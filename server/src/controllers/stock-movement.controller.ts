import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { OkPacket, RowDataPacket } from 'mysql2';

interface StockMovement extends RowDataPacket {
  id: string;
  product_id: string;
  type: 'IN' | 'OUT';
  quantity: number;
  notes?: string;
  created_at: Date;
}

export const stockMovementController = {
  // Get all stock movements
  getAll: async (req: Request, res: Response) => {
    try {
      const [movements] = await db.query<StockMovement[]>(`
        SELECT sm.*, p.name as product_name 
        FROM stock_movements sm
        JOIN products p ON sm.product_id = p.id
        ORDER BY sm.created_at DESC
      `);
      res.json(movements);
    } catch (error) {
      console.error('Error getting stock movements:', error);
      res.status(500).json({ message: 'Error getting stock movements' });
    }
  },

  // Create new stock movement
  create: async (req: Request, res: Response) => {
    try {
      const { product_id, type, quantity, notes } = req.body;

      if (!product_id || !type || !quantity) {
        return res.status(400).json({ message: 'Product ID, type, and quantity are required' });
      }

      if (type !== 'IN' && type !== 'OUT') {
        return res.status(400).json({ message: 'Type must be either IN or OUT' });
      }

      if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
      }

      // Start transaction
      const connection = await db.getConnection();
      await connection.beginTransaction();

      try {
        // Get current product quantity
        const [products] = await connection.query<RowDataPacket[]>(
          'SELECT quantity FROM products WHERE id = ?',
          [product_id]
        );

        if (products.length === 0) {
          await connection.rollback();
          connection.release();
          return res.status(404).json({ message: 'Product not found' });
        }

        const currentQuantity = products[0].quantity;
        const newQuantity = type === 'IN' 
          ? currentQuantity + quantity
          : currentQuantity - quantity;

        if (newQuantity < 0) {
          await connection.rollback();
          connection.release();
          return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Create stock movement
        const id = uuidv4();
        const [result] = await connection.query<OkPacket>(
          'INSERT INTO stock_movements (id, product_id, type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
          [id, product_id, type, quantity, notes]
        );

        // Update product quantity
        await connection.query(
          'UPDATE products SET quantity = ? WHERE id = ?',
          [newQuantity, product_id]
        );

        await connection.commit();
        connection.release();

        if (result.affectedRows === 1) {
          const [movements] = await db.query<StockMovement[]>(`
            SELECT sm.*, p.name as product_name 
            FROM stock_movements sm
            JOIN products p ON sm.product_id = p.id
            WHERE sm.id = ?
          `, [id]);
          res.status(201).json(movements[0]);
        } else {
          res.status(500).json({ message: 'Error creating stock movement' });
        }
      } catch (error) {
        await connection.rollback();
        connection.release();
        throw error;
      }
    } catch (error) {
      console.error('Error creating stock movement:', error);
      res.status(500).json({ message: 'Error creating stock movement' });
    }
  }
}; 