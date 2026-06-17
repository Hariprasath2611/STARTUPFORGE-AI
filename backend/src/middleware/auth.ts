import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforstartupforgeai2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'founder' | 'investor' | 'mentor' | 'admin';
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = decoded as {
        id: string;
        email: string;
        role: 'founder' | 'investor' | 'mentor' | 'admin';
      };
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header is missing' });
  }
};
