import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Investment } from '../types';

interface TopPerformersProps {
    investments: Investment[];
    showNegative?: boolean;
}

const TopPerformers: React.FC<TopPerformersProps> = ({ investments, showNegative = false }) => {
    console.log('🔍 TopPerformers received investments:', investments);
    console.log('🔍 First investment data:', investments[0]);
    
    const formatCurrency = (value: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(parseFloat(value));
    };

    const formatPercentage = (value: string) => {
        const num = parseFloat(value);
        return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
    };

    const getTypeColor = (type: string) => {
        const colors = {
            STOCK: 'bg-blue-100 text-blue-800',
            BOND: 'bg-green-100 text-green-800',
            MUTUAL_FUND: 'bg-purple-100 text-purple-800',
            ETF: 'bg-orange-100 text-orange-800',
            CRYPTOCURRENCY: 'bg-yellow-100 text-yellow-800',
        };
        return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    if (investments.length === 0) {
        return (
            <div className="text-center py-8">
                <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                    {showNegative ? 'No underperforming investments' : 'No top performers yet'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {investments.slice(0, 5).map((investment) => {
                const returnPercentage = parseFloat(investment.returnPercentage || '0');
                const isPositive = returnPercentage >= 0;
                const shouldShow = showNegative ? !isPositive : isPositive;
                
                if (!shouldShow) return null;

                return (
                    <div key={investment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold text-sm">
                                    {investment.symbol.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm text-gray-900">
                                        {investment.symbol}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(investment.type)}`}>
                                        {investment.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{investment.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-medium text-sm text-gray-900">
                                {formatCurrency(investment.currentValue || '0')}
                            </div>
                            <div className={`text-xs flex items-center justify-end ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {isPositive ? (
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {formatPercentage(investment.returnPercentage || '0')}
                            </div>
                        </div>
                    </div>
                );
            })}
            
            {investments.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                        {showNegative ? 'No underperforming investments' : 'No top performers yet'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TopPerformers;
