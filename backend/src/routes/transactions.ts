import { Router, Response } from 'express';
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

const TransactionType = {
    BUY: 'BUY',
    SELL: 'SELL'
} as const;

type TransactionTypeEnum = typeof TransactionType[keyof typeof TransactionType];

const toNumber = (decimal: any): number => {
    if (typeof decimal === 'number') return decimal;
    if (decimal && typeof decimal.toNumber === 'function') {
        return decimal.toNumber();
    }
    return Number(decimal);
};

const createTransactionSchema = Joi.object({
    investmentId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(TransactionType)).required(),
    quantity: Joi.number().positive().required(),
    price: Joi.number().positive().required(),
    date: Joi.date().iso().optional().default(new Date()),
});

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const type = req.query.type as TransactionTypeEnum;
        const investmentId = req.query.investmentId as string;

        const skip = (page - 1) * limit;

        const where: any = {
            userId: req.user!.id,
        };

        if (type) {
            where.type = type;
        }

        if (investmentId) {
            where.investmentId = investmentId;
        }

        const [transactions, totalCount] = await Promise.all([
            prisma.transaction.findMany({
                where,
                include: {
                    investment: {
                        select: {
                            symbol: true,
                            name: true,
                            type: true,
                            currentPrice: true
                        }
                    }
                },
                orderBy: {
                    date: 'desc'
                },
                skip,
                take: limit,
            }),
            prisma.transaction.count({ where })
        ]);

        const enrichedTransactions = transactions.map((transaction: any) => ({
            ...transaction,
            totalValue: (toNumber(transaction.quantity) * toNumber(transaction.price)).toFixed(2),
            currentValue: (toNumber(transaction.quantity) * toNumber(transaction.investment.currentPrice)).toFixed(2),
            gainLoss: ((toNumber(transaction.quantity) * toNumber(transaction.investment.currentPrice)) -
                (toNumber(transaction.quantity) * toNumber(transaction.price))).toFixed(2)
        }));

        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            transactions: enrichedTransactions,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        logger.error('Error fetching transactions:', error);
        res.status(500).json({
            error: 'Failed to fetch transactions'
        });
    }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId: req.user!.id,
            },
            include: {
                investment: {
                    select: {
                        symbol: true,
                        name: true,
                        type: true,
                        currentPrice: true
                    }
                }
            }
        });

        if (!transaction) {
            return res.status(404).json({
                error: 'Transaction not found'
            });
        }

        const enrichedTransaction = {
            ...transaction,
            totalValue: (toNumber(transaction.quantity) * toNumber(transaction.price)).toFixed(2),
            currentValue: (toNumber(transaction.quantity) * toNumber(transaction.investment.currentPrice)).toFixed(2),
            gainLoss: ((toNumber(transaction.quantity) * toNumber(transaction.investment.currentPrice)) -
                (toNumber(transaction.quantity) * toNumber(transaction.price))).toFixed(2)
        };

        res.json(enrichedTransaction);
    } catch (error) {
        logger.error('Error fetching transaction:', error);
        res.status(500).json({
            error: 'Failed to fetch transaction'
        });
    }
});

router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const { error, value } = createTransactionSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map(d => d.message)
            });
        }

        const { investmentId, type, quantity, price, date } = value;

        const investment = await prisma.investment.findFirst({
            where: {
                id: investmentId,
                userId: req.user!.id,
            }
        });

        if (!investment) {
            return res.status(404).json({
                error: 'Investment not found'
            });
        }

        if (type === TransactionType.SELL) {
            const totalBought = await prisma.transaction.aggregate({
                where: {
                    investmentId,
                    type: TransactionType.BUY
                },
                _sum: {
                    quantity: true
                }
            });

            const totalSold = await prisma.transaction.aggregate({
                where: {
                    investmentId,
                    type: TransactionType.SELL
                },
                _sum: {
                    quantity: true
                }
            });

            const availableQuantity = toNumber(totalBought._sum.quantity || 0) - toNumber(totalSold._sum.quantity || 0);

            if (quantity > availableQuantity) {
                return res.status(400).json({
                    error: 'Insufficient quantity available for sale',
                    available: availableQuantity.toString()
                });
            }
        }

        const transaction = await prisma.transaction.create({
            data: {
                userId: req.user!.id,
                investmentId,
                type,
                quantity,
                price,
                date: new Date(date),
            },
            include: {
                investment: {
                    select: {
                        symbol: true,
                        name: true,
                        type: true,
                        currentPrice: true
                    }
                }
            }
        });

        logger.info(`Transaction created: ${type} ${quantity} ${investment.symbol} for user ${req.user!.email}`);

        if (type === TransactionType.BUY) {
            await prisma.investment.update({
                where: { id: investmentId },
                data: {
                    quantity: {
                        increment: quantity
                    }
                }
            });
        } else if (type === TransactionType.SELL) {
            await prisma.investment.update({
                where: { id: investmentId },
                data: {
                    quantity: {
                        decrement: quantity
                    }
                }
            });
        }

        const enrichedTransaction = {
            ...transaction,
            totalValue: (toNumber(transaction.quantity) * toNumber(transaction.price)).toFixed(2),
            currentValue: (toNumber(transaction.quantity) * toNumber(transaction.investment.currentPrice)).toFixed(2),
        };

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction: enrichedTransaction,
        });
    } catch (error) {
        logger.error('Error creating transaction:', error);
        res.status(500).json({
            error: 'Failed to create transaction'
        });
    }
});

router.get('/stats', async (req: AuthRequest, res: Response) => {
    try {
        const [totalTransactions, buyTransactions, sellTransactions, recentTransactions] = await Promise.all([
            prisma.transaction.count({
                where: { userId: req.user!.id }
            }),
            prisma.transaction.aggregate({
                where: {
                    userId: req.user!.id,
                    type: TransactionType.BUY
                },
                _count: { id: true },
                _sum: { quantity: true, price: true }
            }),
            prisma.transaction.aggregate({
                where: {
                    userId: req.user!.id,
                    type: TransactionType.SELL
                },
                _count: { id: true },
                _sum: { quantity: true, price: true }
            }),
            prisma.transaction.findMany({
                where: { userId: req.user!.id },
                include: {
                    investment: {
                        select: { symbol: true, name: true }
                    }
                },
                orderBy: { date: 'desc' },
                take: 5
            })
        ]);

        res.json({
            totalTransactions,
            buyTransactions: {
                count: buyTransactions._count.id,
                totalQuantity: buyTransactions._sum.quantity?.toString() || '0',
                totalValue: (toNumber(buyTransactions._sum.price || 0) * toNumber(buyTransactions._sum.quantity || 0)).toFixed(2)
            },
            sellTransactions: {
                count: sellTransactions._count.id,
                totalQuantity: sellTransactions._sum.quantity?.toString() || '0',
                totalValue: (toNumber(sellTransactions._sum.price || 0) * toNumber(sellTransactions._sum.quantity || 0)).toFixed(2)
            },
            recentTransactions: recentTransactions.map((t: any) => ({
                ...t,
                totalValue: (toNumber(t.quantity) * toNumber(t.price)).toFixed(2)
            }))
        });
    } catch (error) {
        logger.error('Error fetching transaction stats:', error);
        res.status(500).json({
            error: 'Failed to fetch transaction statistics'
        });
    }
});

export default router;
