export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Investment {
    id: string;
    userId: string;
    symbol: string;
    name: string;
    type: 'STOCK' | 'BOND' | 'MUTUAL_FUND' | 'ETF' | 'CRYPTOCURRENCY';
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Transaction {
    id: string;
    userId: string;
    investmentId: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    date: Date;
    createdAt: Date;
}

export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export const InvestmentType = {
    STOCK: 'STOCK',
    BOND: 'BOND',
    MUTUAL_FUND: 'MUTUAL_FUND',
    ETF: 'ETF',
    CRYPTOCURRENCY: 'CRYPTOCURRENCY'
} as const;
