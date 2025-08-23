import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Access token required'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'fallback-secret'
        ) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        if (!user) {
            return res.status(401).json({
                error: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                error: 'Invalid token'
            });
        }

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                error: 'Token expired'
            });
        }

        logger.error('Authentication middleware error:', error);
        return res.status(500).json({
            error: 'Internal server error during authentication'
        });
    }
};

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('Error occurred:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
    });

    if (error.code === 'P2002') {
        return res.status(409).json({
            error: 'Unique constraint violation',
            details: 'Resource already exists'
        });
    }

    if (error.code === 'P2025') {
        return res.status(404).json({
            error: 'Record not found'
        });
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: error.message
        });
    }

    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token'
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired'
        });
    }

    res.status(error.statusCode || 500).json({
        error: error.message || 'Internal server error'
    });
};
