import React from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar, DollarSign } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface RecentTransactionsProps {
    transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
    const formatCurrency = (value: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(parseFloat(value));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const getTransactionIcon = (type: TransactionType) => {
        return type === 'BUY' ? (
            <ArrowUpRight className="h-4 w-4 text-green-600" />
        ) : (
            <ArrowDownRight className="h-4 w-4 text-red-600" />
        );
    };

    const getTransactionColor = (type: TransactionType) => {
        return type === 'BUY' ? 'text-green-600' : 'text-red-600';
    };

    const getTransactionBgColor = (type: TransactionType) => {
        return type === 'BUY' ? 'bg-green-100' : 'bg-red-100';
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent transactions</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getTransactionBgColor(transaction.type)}`}>
                            {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm text-gray-900">
                                    {transaction.investment?.symbol}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${getTransactionBgColor(transaction.type)} ${getTransactionColor(transaction.type)}`}>
                                    {transaction.type}
                                </span>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(transaction.date)}
                                </span>
                                <span className="flex items-center">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    {transaction.quantity} shares
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-medium text-sm text-gray-900">
                            {formatCurrency(transaction.totalValue || '0')}
                        </div>
                        <div className="text-xs text-gray-500">
                            @ {formatCurrency(transaction.price)}
                        </div>
                    </div>
                </div>
            ))}
            
            {transactions.length > 5 && (
                <div className="text-center pt-2">
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        View All Transactions
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentTransactions;
