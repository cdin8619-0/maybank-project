import { apiClient } from './apiClient';
import { User } from '../types';

interface LoginResponse {
    user: User;
    token: string;
    message: string;
}

interface RegisterResponse {
    user: User;
    token: string;
    message: string;
}

interface VerifyTokenResponse {
    user: User;
    valid: boolean;
}

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    async register(name: string, email: string, password: string): Promise<RegisterResponse> {
        const response = await apiClient.post('/auth/register', { name, email, password });
        return response.data;
    },

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
    },

    async verifyToken(): Promise<VerifyTokenResponse> {
        const response = await apiClient.get('/auth/verify');
        return response.data;
    },
};
