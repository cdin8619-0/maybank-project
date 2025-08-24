import { apiClient } from './apiClient';
import { Investment, InvestmentFormData } from '../types';

export const investmentService = {
    async getInvestments(): Promise<{ data: Investment[]; total: number }> {
        const response = await apiClient.get('/investments');
        return response.data;
    },

    async getInvestment(id: string): Promise<Investment> {
        const response = await apiClient.get(`/investments/${id}`);
        return response.data;
    },

    async createInvestment(data: InvestmentFormData): Promise<{ message: string; investment: Investment }> {
        const response = await apiClient.post('/investments', data);
        return response.data;
    },

    async updateInvestment(id: string, data: Partial<InvestmentFormData>): Promise<{ message: string; investment: Investment }> {
        const response = await apiClient.put(`/investments/${id}`, data);
        return response.data;
    },

    async deleteInvestment(id: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`/investments/${id}`);
        return response.data;
    },
};
