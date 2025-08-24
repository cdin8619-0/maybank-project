import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { useNavigationRefresh } from '../hooks/useNavigationRefresh';

const getTypeColor = (type: string) => {
    switch (type) {
        case 'STOCK':
            return 'bg-blue-100 text-blue-800';
        case 'BOND':
            return 'bg-green-100 text-green-800';
        case 'ETF':
            return 'bg-purple-100 text-purple-800';
        case 'MUTUAL_FUND':
            return 'bg-orange-100 text-orange-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [portfolioData, setPortfolioData] = useState<PortfolioOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPortfolioData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await portfolioService.getPortfolioOverview();
            console.log('🔍 Dashboard fetched data:', data);
            console.log('🔍 Summary:', data.summary);
            console.log('🔍 Asset Allocation:', data.assetAllocation);
            setPortfolioData(data);
        } catch (error: any) {
            console.error('❌ Dashboard fetch error:', error);
            const errorMessage = error.response?.data?.error || 'Failed to load portfolio data';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolioData();
    }, []); 

    useEffect(() => {
        if (portfolioData) {
            console.log('🔍 Dashboard topPerformers data:', portfolioData.topPerformers);
            console.log('🔍 Dashboard worstPerformers data:', portfolioData.worstPerformers);
        }
    }, [portfolioData]);

    useNavigationRefresh(fetchPortfolioData);

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
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h1 className="text-xl font-bold text-gray-900">Portfolio Dashboard</h1>
                <p className="text-gray-600 mt-1 text-sm">
                    Overview of your investment portfolio performance
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Portfolio Value"
                    value={`$${parseFloat(summary.totalValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    icon={DollarSign}
                    iconColor="text-indigo-600"
                    iconBgColor="bg-indigo-50"
                />

                <StatCard
                    title="Total Return"
                    value={`$${parseFloat(summary.totalReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    subtitle={`${parseFloat(summary.totalReturnPercentage).toFixed(2)}%`}
                    icon={returnIcon}
                    iconColor={isPositiveReturn ? 'text-green-600' : 'text-red-600'}
                    iconBgColor={isPositiveReturn ? 'bg-green-50' : 'bg-red-50'}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Asset Allocation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-3">
                        Asset Allocation
                    </h2>
                    <AssetAllocationChart data={assetAllocation} />
                </div>

                {/* Top Performers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                        <TrendingUp size={18} className="text-green-600 mr-2" />
                        Top Performers
                    </h2>
                    <TopPerformers investments={topPerformers} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                        <TrendingDown size={18} className="text-red-600 mr-2" />
                        Worst Performers
                    </h2>
                    <TopPerformers investments={worstPerformers} showNegative />
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <h2 className="text-base font-semibold text-gray-900 mb-3">
                        Recent Transactions
                    </h2>
                    <RecentTransactions transactions={recentTransactions} />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                    <PieChart size={18} className="text-indigo-600 mr-2" />
                    Investment Details
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Investment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Purchase Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Current Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Current Value
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Performance
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {portfolioData.investments.map((investment) => (
                                <tr key={investment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600 font-semibold text-sm">
                                                        {investment.symbol.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {investment.symbol}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {investment.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(investment.type)}`}>
                                            {investment.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {investment.quantity || '0'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${parseFloat(investment.purchasePrice || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${parseFloat(investment.currentPrice || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${parseFloat(investment.currentValue || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {investment.returnPercentage && parseFloat(investment.returnPercentage) >= 0 ? (
                                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                            )}
                                            <span className={`text-sm font-medium ${
                                                investment.returnPercentage && parseFloat(investment.returnPercentage) >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {investment.returnPercentage ? parseFloat(investment.returnPercentage).toFixed(2) : '0.00'}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {summary.totalInvestments === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
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
                        onClick={() => navigate('/investments')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors"
                    >
                        Add Investment
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
