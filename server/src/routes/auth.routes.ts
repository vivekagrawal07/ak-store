import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, User } from '../models/user.model';

const router = express.Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const userData: User = req.body;
    
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create new user
    const newUser = await UserModel.create(userData);
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: { user: newUser, token }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Validate password
    const isValidPassword = await UserModel.validatePassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      data: { user: userWithoutPassword, token }
    });
  } catch (error) {
    next(error);
  }
});

export const authRoutes = router; 