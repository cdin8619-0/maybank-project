import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

const BASE_URL = 'http://localhost:3001';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: `${BASE_URL}/api`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.request.use(
            (config) => {
                const token = (globalThis as any).localStorage?.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    (globalThis as any).localStorage?.removeItem('token');
                    (globalThis as any).location.href = '/login';
                } else if (error.response?.status && error.response.status >= 500) {
                    toast.error('Server error. Please try again later.');
                } else if (error.code === 'NETWORK_ERROR') {
                    toast.error('Network error. Please check your connection.');
                }

                return Promise.reject(error);
            }
        );
    }

    async get(url: string, config?: any) {
        return this.client.get(url, config);
    }

    async post(url: string, data?: any, config?: any) {
        return this.client.post(url, data, config);
    }

    async put(url: string, data?: any, config?: any) {
        return this.client.put(url, data, config);
    }

    async delete(url: string, config?: any) {
        return this.client.delete(url, config);
    }

    async patch(url: string, data?: any, config?: any) {
        return this.client.patch(url, data, config);
    }
}

export const apiClient = new ApiClient();
