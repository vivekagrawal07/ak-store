import pool from '../config/database';

export interface Product {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  created_at?: Date;
  updated_at?: Date;
}

export class ProductModel {
  static async create(product: Product): Promise<Product> {
    const [result]: any = await pool.query(
      'INSERT INTO products (name, price, quantity, category) VALUES (?, ?, ?, ?)',
      [product.name, product.price, product.quantity, product.category]
    );
    return { ...product, id: result.insertId };
  }

  static async findAll(): Promise<Product[]> {
    const [rows] = await pool.query('SELECT * FROM products');
    return rows as Product[];
  }

  static async findById(id: number): Promise<Product | null> {
    const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async update(id: number, product: Partial<Product>): Promise<boolean> {
    const [result]: any = await pool.query(
      'UPDATE products SET ? WHERE id = ?',
      [product, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result]: any = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
} 