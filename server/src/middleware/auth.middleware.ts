import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as {
      id: number;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}; 