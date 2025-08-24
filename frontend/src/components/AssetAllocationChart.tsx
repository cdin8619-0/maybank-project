import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AssetAllocation } from '../types';

interface AssetAllocationChartProps {
    data: AssetAllocation;
}

const COLORS = {
    STOCK: '#3B82F6',
    BOND: '#10B981',
    MUTUAL_FUND: '#F59E0B',
    ETF: '#8B5CF6',
    CRYPTOCURRENCY: '#EF4444',
};

const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ data }) => {
    const chartData = Object.entries(data).map(([type, info]) => ({
        name: type.replace('_', ' '),
        value: info.percentage,
        count: info.count,
        color: COLORS[type as keyof typeof COLORS] || '#6B7280',
    }));

    if (chartData.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                No data available
            </div>
        );
    }

    // If there's only one type, make it more visually appealing
    if (chartData.length === 1) {
        return (
            <div className="h-64 flex flex-col items-center justify-center">
                <div className="w-32 h-32 rounded-full flex items-center justify-center mb-4" 
                     style={{ backgroundColor: chartData[0].color + '20', border: `4px solid ${chartData[0].color}` }}>
                    <span className="text-2xl font-bold" style={{ color: chartData[0].color }}>
                        {chartData[0].value.toFixed(0)}%
                    </span>
                </div>
                <div className="text-center">
                    <p className="font-semibold text-gray-900">{chartData[0].name}</p>
                    <p className="text-sm text-gray-500">{chartData[0].count} investment{chartData[0].count !== 1 ? 's' : ''}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Allocation']}
                        labelFormatter={(label) => `${label}`}
                    />
                    <Legend
                        formatter={(value, entry) => (
                            <span style={{ color: entry.color }}>
                {value} ({(entry.payload as any)?.count} investments)
              </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AssetAllocationChart;
