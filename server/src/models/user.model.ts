import pool from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  created_at?: Date;
}

export class UserModel {
  static async create(user: User): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result]: any = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [user.username, user.email, hashedPassword, user.role]
    );
    
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, id: result.insertId };
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
} 