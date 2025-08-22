export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
};

export const calculateReturn = (currentValue: number, initialValue: number): {
    absolute: number;
    percentage: number;
} => {
    const absolute = currentValue - initialValue;
    const percentage = initialValue > 0 ? (absolute / initialValue) * 100 : 0;

    return {
        absolute,
        percentage,
    };
};

export const generateRandomId = (): string => {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
};

export const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
};