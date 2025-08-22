export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export type InvestmentType = 'STOCK' | 'BOND' | 'MUTUAL_FUND' | 'ETF' | 'CRYPTOCURRENCY';

export interface Investment {
    id: string;
    userId: string;
    symbol: string;
    name: string;
    type: InvestmentType;
    quantity: string;
    purchasePrice: string;
    currentPrice: string;
    createdAt: string;
    updatedAt: string;
    totalValue?: string;
    totalCost?: string;
    totalReturn?: string;
    returnPercentage?: string;
    transactions?: Transaction[];
    _count?: {
        transactions: number;
    };
}

export type TransactionType = 'BUY' | 'SELL';

export interface Transaction {
    id: string;
    userId: string;
    investmentId: string;
    type: TransactionType;
    quantity: string;
    price: string;
    date: string;
    createdAt: string;
    investment?: {
        symbol: string;
        name: string;
        type: InvestmentType;
        currentPrice: string;
    };
    totalValue?: string;
    currentValue?: string;
    gainLoss?: string;
}

export interface PortfolioSummary {
    totalValue: string;
    totalCost: string;
    totalReturn: string;
    totalReturnPercentage: string;
    totalInvestments: number;
    totalTransactions: number;
}

export interface AssetAllocation {
    [key: string]: {
        value: number;
        count: number;
        percentage: number;
    };
}

export interface PortfolioOverview {
    summary: PortfolioSummary;
    assetAllocation: AssetAllocation;
    topPerformers: Investment[];
    worstPerformers: Investment[];
    recentTransactions: Transaction[];
    investments: Investment[];
}

export interface ApiError {
    error: string;
    details?: string[];
}

export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
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

export interface InvestmentFormData {
    symbol: string;
    name: string;
    type: InvestmentType;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
}

export interface TransactionFormData {
    investmentId: string;
    type: TransactionType;
    quantity: number;
    price: number;
    date?: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ChartDataPoint {
    name: string;
    value: number;
    percentage?: number;
    color?: string;
}

export interface PerformanceChartData {
    date: string;
    value: number;
    return: number;
}

export interface SelectOption {
    value: string;
    label: string;
}

export interface TableColumn<T = any> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

export interface FilterOptions {
    type?: InvestmentType;
    transactionType?: TransactionType;
    dateRange?: {
        start: string;
        end: string;
    };
    search?: string;
}