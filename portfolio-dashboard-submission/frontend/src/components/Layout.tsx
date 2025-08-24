import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    TrendingUp,
    LayoutDashboard,
    PieChart,
    Activity,
    LogOut,
    Menu,
    X,
    User
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const Layout: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Investments', href: '/investments', icon: PieChart },
        { name: 'Transactions', href: '/transactions', icon: Activity },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Successfully logged out');
        } catch (error) {
            toast.error('Error logging out');
        }
    };

    const isCurrentPath = (path: string) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:hidden">
                    <div className="flex flex-col h-full">
                        {/* Mobile menu header */}
                        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="bg-indigo-600 rounded-lg p-1.5">
                                    <TrendingUp size={18} className="text-white" />
                                </div>
                                <span className="ml-2 text-base font-bold text-gray-900">
                                    Portfolio
                                </span>
                            </div>
                            <button
                                type="button"
                                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Mobile navigation */}
                        <nav className="flex-1 px-4 py-4 space-y-2">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const current = isCurrentPath(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            current
                                                ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Icon
                                            size={18}
                                            className={`mr-3 ${
                                                current ? 'text-indigo-700' : 'text-gray-400'
                                            }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile user section */}
                        <div className="border-t border-gray-200 p-4">
                            <div className="flex items-center mb-3">
                                <div className="bg-gray-100 rounded-full p-1.5">
                                    <User size={16} className="text-gray-600" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <LogOut size={16} className="mr-2 text-gray-400" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top App Bar */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        {/* Logo and Brand */}
                        <div className="flex items-center">
                            <div className="bg-indigo-600 rounded-lg p-2">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">
                                Portfolio
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const current = isCurrentPath(item.href);

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                            current
                                                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <Icon
                                            size={18}
                                            className={`mr-2 ${
                                                current ? 'text-indigo-700' : 'text-gray-400'
                                            }`}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right side - User and Mobile menu */}
                        <div className="flex items-center space-x-4">
                            {/* User info */}
                            <div className="hidden sm:flex items-center space-x-3">
                                <div className="text-sm text-gray-600 font-medium">
                                    Welcome back, {user?.name?.split(' ')[0]}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="bg-gray-100 rounded-full p-1.5">
                                        <User size={16} className="text-gray-600" />
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                type="button"
                                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <Menu size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="flex flex-col min-h-screen bg-gray-50">
                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                © 2025 Portfolio Dashboard. All rights reserved.
                            </div>
                            <div className="text-sm text-gray-400">
                                Built with React & TypeScript
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
