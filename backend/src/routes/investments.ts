import { Router, Response } from 'express';
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';
import {InvestmentType} from "../types";

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

const createInvestmentSchema = Joi.object({
    symbol: Joi.string().max(20).required(),
    name: Joi.string().max(200).required(),
    type: Joi.string().valid(...Object.values(InvestmentType)).required(),
    quantity: Joi.number().positive().required(),
    purchasePrice: Joi.number().positive().required(),
    currentPrice: Joi.number().positive().required(),
});

const updateInvestmentSchema = Joi.object({
    symbol: Joi.string().max(20),
    name: Joi.string().max(200),
    type: Joi.string().valid(...Object.values(InvestmentType)),
    quantity: Joi.number().positive(),
    purchasePrice: Joi.number().positive(),
    currentPrice: Joi.number().positive(),
}).min(1);

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const investments = await prisma.investment.findMany({
            where: {
                userId: req.user!.id,
            },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                    take: 5,
                },
                _count: {
                    select: { transactions: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const enrichedInvestments = investments.map((investment: any) => {
            const totalValue = toNumber(investment.quantity) * toNumber(investment.currentPrice);
            const totalCost = toNumber(investment.quantity) * toNumber(investment.purchasePrice);
            const totalReturn = totalValue - totalCost;
            const returnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

            return {
                ...investment,
                totalValue: totalValue.toFixed(2),
                totalCost: totalCost.toFixed(2),
                totalReturn: totalReturn.toFixed(2),
                returnPercentage: returnPercentage.toFixed(2),
            };
        });

        res.json({
            data: enrichedInvestments,
            total: enrichedInvestments.length,
        });
    } catch (error) {
        logger.error('Error fetching investments:', error);
        res.status(500).json({
            error: 'Failed to fetch investments',
        });
    }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        const investment = await prisma.investment.findFirst({
            where: {
                id,
                userId: req.user!.id,
            },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                    take: 10,
                },
            },
        });

        if (!investment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        const totalValue = toNumber(investment.quantity) * toNumber(investment.currentPrice);
        const totalCost = toNumber(investment.quantity) * toNumber(investment.purchasePrice);
        const totalReturn = totalValue - totalCost;
        const returnPercentage = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

        res.json({
            ...investment,
            totalValue: totalValue.toFixed(2),
            totalCost: totalCost.toFixed(2),
            totalReturn: totalReturn.toFixed(2),
            returnPercentage: returnPercentage.toFixed(2),
        });
    } catch (error) {
        logger.error('Error fetching investment:', error);
        res.status(500).json({ error: 'Failed to fetch investment' });
    }
});

router.post('/', async (req: AuthRequest, res: Response) => {
    try {
        const { error, value } = createInvestmentSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map(d => d.message),
            });
        }

        const { symbol, name, type, quantity, purchasePrice, currentPrice } = value;

        const investment = await prisma.investment.create({
            data: {
                userId: req.user!.id,
                symbol: symbol.toUpperCase(),
                name,
                type,
                quantity,
                purchasePrice,
                currentPrice,
            },
            include: { transactions: true },
        });

        logger.info(`Investment created: ${symbol} for user ${req.user!.email}`);

        res.status(201).json({
            message: 'Investment created successfully',
            investment,
        });
    } catch (error) {
        logger.error('Error creating investment:', error);
        res.status(500).json({ error: 'Failed to create investment' });
    }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { error, value } = updateInvestmentSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map(d => d.message),
            });
        }

        const existingInvestment = await prisma.investment.findFirst({
            where: {
                id,
                userId: req.user!.id,
            },
        });

        if (!existingInvestment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        const updateData: any = { ...value };
        if (updateData.symbol) {
            updateData.symbol = updateData.symbol.toUpperCase();
        }

        const investment = await prisma.investment.update({
            where: { id },
            data: updateData,
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                    take: 10,
                },
            },
        });

        logger.info(`Investment updated: ${investment.symbol} for user ${req.user!.email}`);

        res.json({
            message: 'Investment updated successfully',
            investment,
        });
    } catch (error) {
        logger.error('Error updating investment:', error);
        res.status(500).json({ error: 'Failed to update investment' });
    }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const existingInvestment = await prisma.investment.findFirst({
            where: {
                id,
                userId: req.user!.id,
            },
            include: {
                _count: {
                    select: { transactions: true },
                },
            },
        });

        if (!existingInvestment) {
            return res.status(404).json({ error: 'Investment not found' });
        }

        await prisma.investment.delete({
            where: { id },
        });

        logger.info(`Investment deleted: ${existingInvestment.symbol} for user ${req.user!.email}`);

        res.json({ message: 'Investment deleted successfully' });
    } catch (error) {
        logger.error('Error deleting investment:', error);
        res.status(500).json({ error: 'Failed to delete investment' });
    }
});

export default router;
