import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface CustomError extends Error {
    statusCode?: number;
}

export function errorHandler(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`, {
        stack: err.stack,
        body: req.body,
        query: req.query,
        params: req.params,
    });

    const statusCode = err.statusCode || 500;
    const message =
        process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message;

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            statusCode,
        },
    });
}
