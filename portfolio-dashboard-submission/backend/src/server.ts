import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth';
import portfolioRoutes from './routes/portfolio';
import investmentRoutes from './routes/investments';
import transactionRoutes from './routes/transactions';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 5000;

app.use(helmet());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['http://localhost:5173']
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/transactions', transactionRoutes);

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

async function startServer(initialPort: number = PORT) {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');

        const listen = (port: number): Promise<void> => {
            return new Promise((resolve, reject) => {
                const server = app.listen(port)
                    .on('listening', () => {
                        logger.info(`Server running on port ${port}`);
                        resolve();
                    })
                    .on('error', (err: NodeJS.ErrnoException) => {
                        if (err.code === 'EADDRINUSE') {
                            logger.error(`Port ${port} is already in use. Trying ${port + 1}`);
                            server.close();
                            listen(port + 1).then(resolve).catch(reject);
                        } else {
                            reject(err);
                        }
                    });
            });
        };

        await listen(initialPort);

    } catch (error) {
        logger.error('Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    logger.info('Received SIGINT. Graceful shutdown...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM. Graceful shutdown...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
