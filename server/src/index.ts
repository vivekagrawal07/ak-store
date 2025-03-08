import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { productRoutes } from './routes/product.routes';
import { authRoutes } from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 