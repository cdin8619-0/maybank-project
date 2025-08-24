import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { investmentService } from '../services/investmentService';
import { InvestmentType, InvestmentFormData, Investment } from '../types';

const investmentSchema = z.object({
    symbol: z.string().min(1, 'Symbol is required').max(10, 'Symbol too long'),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    type: z.enum(['STOCK', 'BOND', 'MUTUAL_FUND', 'ETF', 'CRYPTOCURRENCY']),
    quantity: z.number().positive('Quantity must be positive'),
    purchasePrice: z.number().positive('Purchase price must be positive'),
    currentPrice: z.number().positive('Current price must be positive'),
});

interface AddInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingInvestment?: Investment | null;
}

const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({ isOpen, onClose, onSuccess, editingInvestment }) => {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<InvestmentFormData>({
        resolver: zodResolver(investmentSchema),
        defaultValues: {
            type: 'STOCK',
        },
    });

    // Set form values when editing
    React.useEffect(() => {
        if (editingInvestment) {
            setValue('symbol', editingInvestment.symbol);
            setValue('name', editingInvestment.name);
            setValue('type', editingInvestment.type);
            setValue('quantity', parseFloat(editingInvestment.quantity));
            setValue('purchasePrice', parseFloat(editingInvestment.purchasePrice));
            setValue('currentPrice', parseFloat(editingInvestment.currentPrice));
        } else {
            reset();
        }
    }, [editingInvestment, setValue, reset]);

    const onSubmit = async (data: InvestmentFormData) => {
        setIsLoading(true);
        try {
            if (editingInvestment) {
                await investmentService.updateInvestment(editingInvestment.id, data);
                toast.success('Investment updated successfully!');
            } else {
                await investmentService.createInvestment(data);
                toast.success('Investment added successfully!');
            }
            reset();
            onSuccess();
            onClose();
        } catch (error: any) {
            const action = editingInvestment ? 'update' : 'add';
            toast.error(error.response?.data?.error || `Failed to ${action} investment`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {editingInvestment ? 'Edit Investment' : 'Add Investment'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Symbol *
                        </label>
                        <input
                            {...register('symbol')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., AAPL"
                        />
                        {errors.symbol && (
                            <p className="text-red-500 text-sm mt-1">{errors.symbol.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            {...register('name')}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Apple Inc."
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type *
                        </label>
                        <select
                            {...register('type')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="STOCK">Stock</option>
                            <option value="BOND">Bond</option>
                            <option value="MUTUAL_FUND">Mutual Fund</option>
                            <option value="ETF">ETF</option>
                            <option value="CRYPTOCURRENCY">Cryptocurrency</option>
                        </select>
                        {errors.type && (
                            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity *
                        </label>
                        <input
                            {...register('quantity', { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., 10"
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Purchase Price *
                        </label>
                        <input
                            {...register('purchasePrice', { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., 150.00"
                        />
                        {errors.purchasePrice && (
                            <p className="text-red-500 text-sm mt-1">{errors.purchasePrice.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Price *
                        </label>
                        <input
                            {...register('currentPrice', { valueAsNumber: true })}
                            type="number"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., 155.00"
                        />
                        {errors.currentPrice && (
                            <p className="text-red-500 text-sm mt-1">{errors.currentPrice.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                                editingInvestment ? null : <Plus className="h-4 w-4 mr-2" />
                            )}
                            {editingInvestment ? 'Update Investment' : 'Add Investment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInvestmentModal;
