"use client";

import { formatCurrency } from '@/utils/formatters';
import { useTheme } from '@/hooks/useTheme'; // We'll create this

export default function StatsCard({ title, value, icon: Icon, color, change, changeType, isPercentage }) {
    const { isDark } = useTheme();
    const formattedValue = isPercentage ? `${value.toFixed(1)}%` : formatCurrency(value);

    // Map color variants for dark mode
    const getColorClasses = () => {
        const colorMap = {
            'bg-blue-500': isDark ? 'bg-blue-600' : 'bg-blue-500',
            'bg-green-500': isDark ? 'bg-green-600' : 'bg-green-500',
            'bg-purple-500': isDark ? 'bg-purple-600' : 'bg-purple-500',
            'bg-yellow-500': isDark ? 'bg-yellow-600' : 'bg-yellow-500',
            'bg-red-500': isDark ? 'bg-red-600' : 'bg-red-500',
            'bg-indigo-500': isDark ? 'bg-indigo-600' : 'bg-indigo-500',
            'bg-pink-500': isDark ? 'bg-pink-600' : 'bg-pink-500',
            'bg-orange-500': isDark ? 'bg-orange-600' : 'bg-orange-500',
        };
        return colorMap[color] || (isDark ? 'bg-gray-700' : 'bg-gray-500');
    };

    const getTextColor = () => {
        return isDark ? 'text-gray-300' : 'text-gray-500';
    };

    const getCardBg = () => {
        return isDark ? 'bg-gray-950/50 border border-gray-900' : 'bg-white border-gray-100';
    };

    const getChangeColor = () => {
        if (changeType === 'positive') {
            return isDark ? 'text-green-400' : 'text-green-600';
        }
        return isDark ? 'text-red-400' : 'text-red-600';
    };

    return (
        <div className={`${getCardBg()} rounded-xl shadow-sm p-6 hover:shadow-md`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className={`${getTextColor()} text-sm`}>{title}</p>
                    <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formattedValue}
                    </p>
                    {change && (
                        <p className={`text-sm mt-2 ${getChangeColor()}`}>
                            {change} from last month
                        </p>
                    )}
                </div>
                <div className={`${getColorClasses()} p-3 rounded-lg `}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
}