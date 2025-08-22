import React, { useEffect, useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    Activity,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { toast } from 'sonner';

import { portfolioService } from '../services/portfolioService';
import { PortfolioOverview } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import StatCard from '../components/StatCard';
import AssetAllocationChart from '../components/AssetAllocationChart';
import RecentTransactions from '../components/RecentTransactions';
import TopPerformers from '../components/TopPerformers';

const DashboardPage: React.FC = () => {
    const [portfolioData, setPortfolioData] = useState<PortfolioOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const fetchPortfolioData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await portfolioService.getPortfolioOverview();
            setPortfolioData(data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to load portfolio data';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !portfolioData) {
        return (
            <div className="min-h-96 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <Activity size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Unable to Load Portfolio
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {error || 'Something went wrong while loading your portfolio data.'}
                    </p>
                    <button
                        onClick={fetchPortfolioData}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const { summary, assetAllocation, topPerformers, worstPerformers, recentTransactions } = portfolioData;

    const isPositiveReturn = parseFloat(summary.totalReturn) >= 0;
    const returnIcon = isPositiveReturn ? ArrowUpRight : ArrowDownRight;
    const returnColor = isPositiveReturn ? 'text-success-600' : 'text-danger-600';
    const returnBgColor = isPositiveReturn ? 'bg-success-50' : 'bg-danger-50';

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Overview of your investment portfolio performance
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Portfolio Value"
                    value={`$${summary.totalValue}`}
                    icon={DollarSign}
                    iconColor="text-primary-600"
                    iconBgColor="bg-primary-50"
                />

                <StatCard
                    title="Total Return"
                    value={`$${summary.totalReturn}`}
                    subtitle={`${summary.totalReturnPercentage}%`}
                    icon={returnIcon}
                    iconColor={returnColor}
                    iconBgColor={returnBgColor}
                />

                <StatCard
                    title="Total Investments"
                    value={summary.totalInvestments.toString()}
                    icon={PieChart}
                    iconColor="text-indigo-600"
                    iconBgColor="bg-indigo-50"
                />

                <StatCard
                    title="Total Transactions"
                    value={summary.totalTransactions.toString()}
                    icon={Activity}
                    iconColor="text-green-600"
                    iconBgColor="bg-green-50"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Asset Allocation */}
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Asset Allocation
                    </h2>
                    <AssetAllocationChart data={assetAllocation} />
                </div>

                {/* Top Performers */}
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp size={20} className="text-success-600 mr-2" />
                        Top Performers
                    </h2>
                    <TopPerformers investments={topPerformers} />
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Worst Performers */}
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingDown size={20} className="text-danger-600 mr-2" />
                        Worst Performers
                    </h2>
                    <TopPerformers investments={worstPerformers} showNegative />
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-lg shadow-soft p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Recent Transactions
                    </h2>
                    <RecentTransactions transactions={recentTransactions} />
                </div>
            </div>

            {/* Portfolio is Empty State */}
            {summary.totalInvestments === 0 && (
                <div className="bg-white rounded-lg shadow-soft p-8 text-center">
                    <div className="text-gray-400 mb-4">
                        <PieChart size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Your portfolio is empty
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Start building your portfolio by adding your first investment.
                    </p>
                    <button
                        onClick={() => window.location.href = '/investments'}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                        Add Investment
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;