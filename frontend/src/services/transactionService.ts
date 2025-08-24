import { apiClient } from './apiClient';
import { Transaction, TransactionFormData, PaginationResponse } from '../types';

export const transactionService = {
    async getTransactions(page: number = 1, limit: number = 20): Promise<PaginationResponse<Transaction>> {
        const response = await apiClient.get(`/transactions?page=${page}&limit=${limit}`);
        return response.data;
    },

    async getTransaction(id: string): Promise<Transaction> {
        const response = await apiClient.get(`/transactions/${id}`);
        return response.data;
    },

    async createTransaction(data: TransactionFormData): Promise<{ message: string; transaction: Transaction }> {
        const response = await apiClient.post('/transactions', data);
        return response.data;
    },

    async getTransactionStats() {
        const response = await apiClient.get('/transactions/stats');
        return response.data;
    },
};
