import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';
import { HttpStatus } from '../constants';
import { prisma } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Please authenticate');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as { id: number };

    const guest = await prisma.guest.findUnique({
      where: { id: decoded.id },
    });

    if (!guest) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'User not found');
    }

    req.user = {
      id: guest.id,
      email: guest.email,
      role: 'guest',
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid token'));
    } else {
      next(error);
    }
  }
};
