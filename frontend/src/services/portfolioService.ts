import { apiClient } from './apiClient';
import { PortfolioOverview } from '../types';

export const portfolioService = {
    async getPortfolioOverview(): Promise<PortfolioOverview> {
        const timestamp = Date.now();
        const response = await apiClient.get(`/portfolio?t=${timestamp}`);
        console.log('🔍 Portfolio service raw response:', response.data);
        return response.data;
    },

    async getPortfolioSummary() {
        const timestamp = Date.now();
        const response = await apiClient.get(`/portfolio/summary?t=${timestamp}`);
        return response.data;
    },
};
