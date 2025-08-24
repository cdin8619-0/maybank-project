import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

const StatCard: React.FC<StatCardProps> = ({
                                               title,
                                               value,
                                               subtitle,
                                               icon: Icon,
                                               iconColor = 'text-primary-600',
                                               iconBgColor = 'bg-primary-50',
                                               trend
                                           }) => {
    const formattedValue = typeof value === 'string' ? value : String(value);
    const formattedSubtitle = subtitle ? (typeof subtitle === 'string' ? subtitle : String(subtitle)) : null;
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow min-w-0">
            <div className="flex items-center">
                <div className={`${iconBgColor} rounded-lg p-2.5`}>
                    <Icon size={20} className={iconColor} />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 truncate">
                        {title}
                    </p>
                    <div className="flex items-baseline flex-wrap gap-1">
                        <p className="text-2xl font-semibold text-gray-900 break-words min-w-0 flex-1 overflow-hidden text-ellipsis">
                            {formattedValue}
                        </p>
                        {formattedSubtitle && (
                            <p className={`text-sm font-medium break-words min-w-0 ${
                                formattedSubtitle.includes('-') ? 'text-danger-600' : 'text-success-600'
                            }`}>
                                {formattedSubtitle}
                            </p>
                        )}
                    </div>
                    {trend && (
                        <div className="flex items-center mt-1">
              <span className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success-600' : 'text-danger-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}
              </span>
                            <span className="text-sm text-gray-500 ml-1">
                from last month
              </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
