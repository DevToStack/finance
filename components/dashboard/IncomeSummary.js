"use client";

import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/formatters';
import { useTheme } from '@/hooks/useTheme';
import { FiTrendingUp, FiAward, FiBarChart2 } from 'react-icons/fi';

export default function IncomeSummary({ totalIncome, categories }) {
    const { transactions, selectedDateRange } = useFinance();
    const { isDark } = useTheme();

    // Calculate income growth compared to previous period
    const getIncomeGrowth = () => {
        const currentPeriodIncome = transactions
            .filter(t => {
                if (t.type !== 'income') return false;
                const date = new Date(t.date);
                return date >= selectedDateRange.start && date <= selectedDateRange.end;
            })
            .reduce((sum, t) => sum + t.amount, 0);

        const previousStart = new Date(selectedDateRange.start);
        previousStart.setMonth(previousStart.getMonth() - 1);
        const previousEnd = new Date(selectedDateRange.end);
        previousEnd.setMonth(previousEnd.getMonth() - 1);

        const previousPeriodIncome = transactions
            .filter(t => {
                if (t.type !== 'income') return false;
                const date = new Date(t.date);
                return date >= previousStart && date <= previousEnd;
            })
            .reduce((sum, t) => sum + t.amount, 0);

        if (previousPeriodIncome === 0) return 100;
        return ((currentPeriodIncome - previousPeriodIncome) / previousPeriodIncome) * 100;
    };

    // Get main income source
    const mainSource = categories.length > 0
        ? categories.reduce((max, cat) => cat.value > max.value ? cat : max, categories[0])
        : null;

    const growth = getIncomeGrowth();

    // Dynamic classes based on theme
    const totalCardBg = isDark
        ? 'bg-gradient-to-br from-green-700 to-green-800'
        : 'bg-gradient-to-br from-green-500 to-green-600';

    const statCardBg = isDark ? 'bg-gray-950/50 border border-gray-900' : 'bg-white';
    const statCardShadow = isDark ? 'shadow-lg shadow-gray-900/20' : 'shadow-sm';
    const statCardTitle = isDark ? 'text-gray-300' : 'text-gray-700';
    const statCardValue = isDark ? 'text-white' : 'text-gray-800';
    const statCardSubtext = isDark ? 'text-gray-400' : 'text-gray-600';
    const statCardHint = isDark ? 'text-gray-500' : 'text-gray-500';

    const mainSourceIcon = isDark ? 'text-yellow-400' : 'text-yellow-500';
    const streamsIcon = isDark ? 'text-blue-400' : 'text-blue-500';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Income Card - Always has gradient */}
            <div className={`${totalCardBg} rounded-xl p-4 text-white transition-all duration-300`}>
                <div className="flex items-center justify-between mb-2">
                    <FiTrendingUp className="w-5 h-5 opacity-80" />
                    <span className="text-xs opacity-80">Total Income</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                <p className="text-sm opacity-80 mt-1">
                    {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% from last period
                </p>
            </div>

            {/* Main Source Card */}
            <div className={`${statCardBg} ${statCardShadow} rounded-xl p-4 transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-2">
                    <FiAward className={`w-4 h-4 ${mainSourceIcon}`} />
                    <h3 className={`text-sm font-semibold ${statCardTitle}`}>Main Source</h3>
                </div>
                {mainSource ? (
                    <>
                        <p className={`text-lg font-bold ${statCardValue}`}>{mainSource.name}</p>
                        <p className={`text-sm ${statCardSubtext}`}>{formatCurrency(mainSource.value)}</p>
                        <p className={`text-xs ${statCardHint} mt-1`}>
                            {((mainSource.value / totalIncome) * 100).toFixed(1)}% of total
                        </p>
                    </>
                ) : (
                    <p className={`text-sm ${statCardHint}`}>No income yet</p>
                )}
            </div>

            {/* Income Streams Card */}
            <div className={`${statCardBg} ${statCardShadow} rounded-xl p-4 transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-2">
                    <FiBarChart2 className={`w-4 h-4 ${streamsIcon}`} />
                    <h3 className={`text-sm font-semibold ${statCardTitle}`}>Income Streams</h3>
                </div>
                <p className={`text-lg font-bold ${statCardValue}`}>{categories.length}</p>
                <p className={`text-sm ${statCardSubtext}`}>Different sources</p>
                <p className={`text-xs ${statCardHint} mt-1`}>
                    Diversify for stability
                </p>
            </div>
        </div>
    );
}