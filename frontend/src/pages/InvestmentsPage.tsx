import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { investmentService } from '../services/investmentService';
import { Investment, InvestmentType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import AddInvestmentModal from '../components/AddInvestmentModal';
import { useNavigationRefresh } from '../hooks/useNavigationRefresh';

const InvestmentsPage: React.FC = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditingInvestment(null);
    };

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const response = await investmentService.getInvestments();
            setInvestments(response.data || []);
        } catch (error: any) {
            toast.error('Failed to fetch investments');
            setInvestments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []); 
    
    useNavigationRefresh(fetchInvestments);

    const handleDelete = async (id: string) => {
        if (!(globalThis as any).confirm('Are you sure you want to delete this investment?')) return;
        
        try {
            await investmentService.deleteInvestment(id);
            toast.success('Investment deleted successfully');
            fetchInvestments();
        } catch (error: any) {
            toast.error('Failed to delete investment');
        }
    };

    const getTypeColor = (type: InvestmentType) => {
        const colors = {
            STOCK: 'bg-blue-100 text-blue-800',
            BOND: 'bg-green-100 text-green-800',
            MUTUAL_FUND: 'bg-purple-100 text-purple-800',
            ETF: 'bg-orange-100 text-orange-800',
            CRYPTOCURRENCY: 'bg-yellow-100 text-yellow-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
                        <p className="text-gray-600 mt-2">Manage your investment portfolio</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Investment
                    </button>
                </div>

            {investments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <TrendingUp className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No investments</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Get started by adding your first investment.
                    </p>
                    <div className="mt-6">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Investment
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {investments.map((investment) => (
                            <li key={investment.id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                    <span className="text-indigo-600 font-semibold">
                                                        {investment.symbol.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="flex items-center">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {investment.symbol}
                                                    </p>
                                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(investment.type)}`}>
                                                        {investment.type.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">{investment.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatCurrency(investment.totalValue || '0')}
                                                </p>
                                                <div className="flex items-center">
                                                    {investment.returnPercentage && (
                                                        <>
                                                            {parseFloat(investment.returnPercentage) >= 0 ? (
                                                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                                            ) : (
                                                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                                            )}
                                                            <p className={`text-sm ${parseFloat(investment.returnPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {formatPercentage(investment.returnPercentage)}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingInvestment(investment);
                                                        setShowAddModal(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(investment.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                Quantity: {investment.quantity}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                Avg Price: {formatCurrency(investment.purchasePrice)}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Current Price: {formatCurrency(investment.currentPrice)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <AddInvestmentModal
                isOpen={showAddModal}
                onClose={handleCloseModal}
                onSuccess={fetchInvestments}
                editingInvestment={editingInvestment}
            />
        </div>
    </div>
    );
};

export default InvestmentsPage;
