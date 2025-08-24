import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = (globalThis as any).localStorage?.getItem('token');
                if (token) {
                    const userData = await authService.verifyToken();
                    setUser(userData.user);
                }
            } catch (error) {
                (globalThis as any).console?.error('Token verification failed:', error);
                (globalThis as any).localStorage?.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            (globalThis as any).localStorage?.setItem('token', response.token);
            setUser(response.user);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            const response = await authService.register(name, email, password);
            (globalThis as any).localStorage?.setItem('token', response.token);
            setUser(response.user);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout();
        } catch (error) {
            (globalThis as any).console?.error('Logout error:', error);
        } finally {
            (globalThis as any).localStorage?.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
