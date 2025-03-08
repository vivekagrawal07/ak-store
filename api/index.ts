import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { productRoutes } from '../server/src/routes/product.routes';
import { authRoutes } from '../server/src/routes/auth.routes';
import { errorHandler } from '../server/src/middleware/error.middleware';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ak-store-vivekagrawal07.vercel.app', 'https://ak-store-git-main-vivekagrawal07.vercel.app']
    : 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

export default app; 