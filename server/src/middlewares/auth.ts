import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../../shared/types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
    }
  }
}

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Middleware to verify JWT token from Authorization header
 * Sets req.user with decoded token data
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Missing or invalid token' });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.userId = decoded.sub;
    // Additional user data would be fetched from DB in a real scenario
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

/**
 * Role-based access control middleware
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // In real app, fetch user role from DB using req.userId
    const userRole = (req as any).userRole;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }

    next();
  };
}

/**
 * Generate JWT token
 */
export function generateToken(userId: string, email: string, role: string): string {
  const secret = process.env.JWT_SECRET as jwt.Secret;
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRY ?? '7d') as any,
  };

  return jwt.sign(
    {
      sub: userId,
      email,
      role,
    },
    secret,
    options
  );
}

/**
 * Verify token and return decoded payload
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch {
    return null;
  }
}
