"use client";

import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/formatters';
import { useTheme } from '@/hooks/useTheme';
import { FiTrendingDown, FiPieChart, FiCalendar } from 'react-icons/fi';

export default function ExpenseSummary({ totalExpense, categories }) {
    const { transactions, selectedDateRange } = useFinance();
    const { isDark } = useTheme();

    // Calculate average daily expense
    const daysDiff = Math.ceil(
        (selectedDateRange.end - selectedDateRange.start) / (1000 * 60 * 60 * 24)
    );
    const avgDailyExpense = daysDiff > 0 ? totalExpense / daysDiff : 0;

    // Get top spending category
    const topCategory = categories.length > 0
        ? categories.reduce((max, cat) => cat.value > max.value ? cat : max, categories[0])
        : null;

    // Get largest single expense
    const largestExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((max, t) => t.amount > max.amount ? t : max, { amount: 0, description: 'None' });

    // Dynamic classes based on theme
    const totalCardBg = isDark
        ? 'bg-gradient-to-br from-red-700 to-red-800'
        : 'bg-gradient-to-br from-red-500 to-red-600';

    const statCardBg = isDark ? 'bg-gray-950/50 border border-gray-900' : 'bg-white';
    const statCardShadow = isDark ? 'shadow-lg shadow-gray-900/20' : 'shadow-sm';
    const statCardTitle = isDark ? 'text-gray-300' : 'text-gray-700';
    const statCardValue = isDark ? 'text-white' : 'text-gray-800';
    const statCardSubtext = isDark ? 'text-gray-400' : 'text-gray-600';
    const statCardHint = isDark ? 'text-gray-500' : 'text-gray-500';
    const statCardTruncate = isDark ? 'text-gray-400' : 'text-gray-600';

    const topCategoryIcon = isDark ? 'text-purple-400' : 'text-purple-500';
    const largestExpenseIcon = isDark ? 'text-orange-400' : 'text-orange-500';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Spending Card - Always has gradient */}
            <div className={`${totalCardBg} rounded-xl p-4 text-white transition-all duration-300`}>
                <div className="flex items-center justify-between mb-2">
                    <FiTrendingDown className="w-5 h-5 opacity-80" />
                    <span className="text-xs opacity-80">Total Spending</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
                <p className="text-sm opacity-80 mt-1">
                    Avg ${avgDailyExpense.toFixed(2)}/day
                </p>
            </div>

            {/* Top Category Card */}
            <div className={`${statCardBg} ${statCardShadow} rounded-xl p-4 transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-2">
                    <FiPieChart className={`w-4 h-4 ${topCategoryIcon}`} />
                    <h3 className={`text-sm font-semibold ${statCardTitle}`}>Top Category</h3>
                </div>
                {topCategory ? (
                    <>
                        <p className={`text-lg font-bold ${statCardValue}`}>{topCategory.name}</p>
                        <p className={`text-sm ${statCardSubtext}`}>{formatCurrency(topCategory.value)}</p>
                        <p className={`text-xs ${statCardHint} mt-1`}>
                            {((topCategory.value / totalExpense) * 100).toFixed(1)}% of total
                        </p>
                    </>
                ) : (
                    <p className={`text-sm ${statCardHint}`}>No expenses yet</p>
                )}
            </div>

            {/* Largest Expense Card */}
            <div className={`${statCardBg} ${statCardShadow} rounded-xl p-4 transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-2">
                    <FiCalendar className={`w-4 h-4 ${largestExpenseIcon}`} />
                    <h3 className={`text-sm font-semibold ${statCardTitle}`}>Largest Expense</h3>
                </div>
                {largestExpense.amount > 0 ? (
                    <>
                        <p className={`text-lg font-bold ${statCardValue}`}>{formatCurrency(largestExpense.amount)}</p>
                        <p className={`text-sm ${statCardTruncate} truncate`}>{largestExpense.description || 'No description'}</p>
                    </>
                ) : (
                    <p className={`text-sm ${statCardHint}`}>No expenses yet</p>
                )}
            </div>
        </div>
    );
}