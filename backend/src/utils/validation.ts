import Joi from 'joi';

export const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
});

export const investmentQuerySchema = Joi.object({
    type: Joi.string().valid('STOCK', 'BOND', 'MUTUAL_FUND', 'ETF', 'CRYPTOCURRENCY'),
    symbol: Joi.string().max(20),
}).concat(paginationSchema);

export const transactionQuerySchema = Joi.object({
    type: Joi.string().valid('BUY', 'SELL'),
    investmentId: Joi.string(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
}).concat(paginationSchema);