import {Router, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {authenticateToken, AuthRequest} from '../middleware/auth';
import {logger} from '../utils/logger';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

const toNumber = (decimal: any): number => {
    if (typeof decimal === 'number') return decimal;
    if (decimal && typeof decimal.toNumber === 'function') {
        return decimal.toNumber();
    }
    return Number(decimal);
};

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        // Get all investments with transaction counts
        const investments = await prisma.investment.findMany({
            where: {
                userId: req.user!.id,
            },
            include: {
                _count: {
                    select: {
                        transactions: true
                    }
                }
            }
        });

        const recentTransactions = await prisma.transaction.findMany({
            where: {
                userId: req.user!.id,
            },
            include: {
                investment: {
                    select: {
                        symbol: true,
                        name: true,
                        type: true
                    }
                }
            },
            orderBy: {
                date: 'desc'
            },
            take: 10
        });

        let totalValue = 0;
        let totalCost = 0;
        let totalReturn = 0;

        const portfolioByType: Record<string, {
            value: number;
            count: number;
            percentage: number;
        }> = {};

        const enrichedInvestments = investments.map((investment: any) => {
            const currentValue = toNumber(investment.quantity) * toNumber(investment.currentPrice);
            const costBasis = toNumber(investment.quantity) * toNumber(investment.purchasePrice);
            const returnValue = currentValue - costBasis;
            const returnPercentage = costBasis > 0 ? (returnValue / costBasis) * 100 : 0;

            totalValue += currentValue;
            totalCost += costBasis;
            totalReturn += returnValue;

            if (!portfolioByType[investment.type]) {
                portfolioByType[investment.type] = {
                    value: 0,
                    count: 0,
                    percentage: 0
                };
            }
            portfolioByType[investment.type].value += currentValue;
            portfolioByType[investment.type].count += 1;

            return {
                ...investment,
                currentValue: currentValue.toFixed(2),
                costBasis: costBasis.toFixed(2),
                returnValue: returnValue.toFixed(2),
                returnPercentage: returnPercentage.toFixed(2),
            };
        });

        Object.keys(portfolioByType).forEach(type => {
            portfolioByType[type].percentage = totalValue > 0
                ? Number(((portfolioByType[type].value / totalValue) * 100).toFixed(2))
                : 0;
        });

        const totalReturnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

        const performanceMetrics = {
            totalValue: totalValue.toFixed(2),
            totalCost: totalCost.toFixed(2),
            totalReturn: totalReturn.toFixed(2),
            totalReturnPercentage: totalReturnPercentage.toFixed(2),
            totalInvestments: investments.length,
            totalTransactions: recentTransactions.length,
        };

        const sortedByPerformance = enrichedInvestments
            .sort((a: any, b: any) => parseFloat(b.returnPercentage) - parseFloat(a.returnPercentage));

        const topPerformers = sortedByPerformance.slice(0, 3);
        const worstPerformers = sortedByPerformance.slice(-3).reverse();

        res.json({
            summary: performanceMetrics,
            assetAllocation: portfolioByType,
            topPerformers,
            worstPerformers,
            recentTransactions: recentTransactions.map((transaction: any) => ({
                ...transaction,
                totalValue: (toNumber(transaction.quantity) * toNumber(transaction.price)).toFixed(2)
            })),
            investments: enrichedInvestments,
        });
    } catch (error) {
        logger.error('Error fetching portfolio:', error);
        res.status(500).json({
            error: 'Failed to fetch portfolio data'
        });
    }
});

router.get('/summary', async (req: AuthRequest, res: Response) => {
    try {
        const [
            investmentCount,
            transactionCount,
            investments
        ] = await Promise.all([
            prisma.investment.count({
                where: {userId: req.user!.id}
            }),
            prisma.transaction.count({
                where: {userId: req.user!.id}
            }),
            prisma.investment.findMany({
                where: {userId: req.user!.id},
                select: {
                    quantity: true,
                    purchasePrice: true,
                    currentPrice: true,
                    type: true
                }
            })
        ]);

        let totalValue = 0;
        let totalCost = 0;

        const typeBreakdown: Record<string, number> = {};

        investments.forEach((investment: any) => {
            const value = toNumber(investment.quantity) * toNumber(investment.currentPrice);
            const cost = toNumber(investment.quantity) * toNumber(investment.purchasePrice);

            totalValue += value;
            totalCost += cost;

            typeBreakdown[investment.type] = (typeBreakdown[investment.type] || 0) + value;
        });

        const totalReturn = totalValue - totalCost;
        const returnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

        res.json({
            totalValue: totalValue.toFixed(2),
            totalCost: totalCost.toFixed(2),
            totalReturn: totalReturn.toFixed(2),
            returnPercentage: returnPercentage.toFixed(2),
            investmentCount,
            transactionCount,
            typeBreakdown: Object.entries(typeBreakdown).map(([type, value]) => ({
                type,
                value: value.toFixed(2),
                percentage: totalValue > 0 ? ((value / totalValue) * 100).toFixed(2) : '0.00'
            }))
        });
    } catch (error) {
        logger.error('Error fetching portfolio summary:', error);
        res.status(500).json({
            error: 'Failed to fetch portfolio summary'
        });
    }
});

export default router;
