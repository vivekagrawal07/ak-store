import { db } from '../config/database';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
  try {
    // Read and execute users table migration
    const usersSQL = fs.readFileSync(
      path.join(__dirname, 'users.sql'),
      'utf8'
    );
    await db.query(usersSQL);
    console.log('Users table migration completed');

    // Read and execute products table migration
    const productsSQL = `
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    `;
    await db.query(productsSQL);
    console.log('Products table migration completed');

    // Read and execute categories table migration
    const categoriesSQL = `
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
    `;
    await db.query(categoriesSQL);
    console.log('Categories table migration completed');

    // Read and execute stock movements table migration
    const stockMovementsSQL = `
    CREATE TABLE IF NOT EXISTS stock_movements (
      id VARCHAR(36) PRIMARY KEY,
      product_id VARCHAR(36) NOT NULL,
      type ENUM('IN', 'OUT') NOT NULL,
      quantity INT NOT NULL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
    `;
    await db.query(stockMovementsSQL);
    console.log('Stock movements table migration completed');

    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigration(); 