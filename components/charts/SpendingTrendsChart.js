"use client";

import { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { FiBarChart2, FiCalendar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function SpendingTrendsChart() {
    const { monthlyTrends } = useFinance();
    const [startMonth, setStartMonth] = useState('all');
    const [endMonth, setEndMonth] = useState('all');
    const { isDark } = useTheme();

    const formatMonth = (monthKey) => {
        const [year, month] = monthKey.split('-');
        return new Date(year, parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Get all available months sorted chronologically
    const availableMonths = useMemo(() => {
        return monthlyTrends.map(trend => ({
            key: trend.month,
            label: formatMonth(trend.month)
        })).sort((a, b) => a.key.localeCompare(b.key));
    }, [monthlyTrends]);

    // Filter data based on selected month range
    const filteredData = useMemo(() => {
        if (monthlyTrends.length === 0) return [];

        let filtered = [...monthlyTrends];

        if (startMonth !== 'all') {
            const startIndex = monthlyTrends.findIndex(t => t.month === startMonth);
            if (startIndex !== -1) {
                filtered = filtered.slice(startIndex);
            }
        }

        if (endMonth !== 'all') {
            const endIndex = monthlyTrends.findIndex(t => t.month === endMonth);
            if (endIndex !== -1) {
                filtered = filtered.slice(0, endIndex + 1);
            }
        }

        return filtered.map(trend => ({
            month: formatMonth(trend.month),
            monthKey: trend.month,
            income: trend.income,
            expense: trend.expense,
            savings: trend.income - trend.expense,
            savingsRate: trend.income > 0 ? ((trend.income - trend.expense) / trend.income * 100) : 0
        }));
    }, [monthlyTrends, startMonth, endMonth]);

    const data = filteredData;

    // Dynamic classes based on theme
    const emptyStateBg = isDark ? 'bg-black' : 'bg-gray-50';
    const emptyStateText = isDark ? 'text-gray-400' : 'text-gray-500';
    const emptyStateSubtext = isDark ? 'text-gray-500' : 'text-gray-400';
    const emptyStateIconBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
    const emptyStateIconColor = isDark ? 'text-gray-600' : 'text-gray-400';

    const cardBg = isDark ? 'bg-gray-950/50 border-gray-900' : 'bg-white border-gray-100';
    const cardTitle = isDark ? 'text-white' : 'text-gray-800';
    const labelText = isDark ? 'text-gray-300' : 'text-gray-700';
    const selectBg = isDark ? 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
    const selectFocus = isDark ? 'focus:ring-blue-600 focus:border-blue-600' : 'focus:ring-blue-500 focus:border-blue-500';

    const chartGrid = isDark ? '#374151' : '#f0f0f0';
    const chartAxisTick = isDark ? '#9CA3AF' : '#6B7280';
    const chartAxisLine = isDark ? '#374151' : '#f0f0f0';
    const chartIncomeFill = isDark ? '#60A5FA' : '#3B82F6';
    const chartExpenseFill = isDark ? '#F87171' : '#EF4444';

    const summaryBg = isDark ? 'bg-gray-800/50' : 'bg-gray-50';
    const summaryText = isDark ? 'text-gray-400' : 'text-gray-500';

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} p-3 rounded-lg shadow-lg border transition-colors duration-200`}>
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>{label}</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Income: <span className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{formatCurrency(payload[0]?.value || 0)}</span>
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Expenses: <span className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-500'}`}>{formatCurrency(payload[1]?.value || 0)}</span>
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1 pt-1 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                        Savings: <span className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            {formatCurrency((payload[0]?.value || 0) - (payload[1]?.value || 0))}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (data.length === 0) {
        return (
            <div className={`${cardBg} rounded-2xl p-6 shadow-sm border transition-colors duration-300`}>
                <h3 className={`text-lg font-semibold ${cardTitle} mb-4`}>Spending Trends</h3>
                <div className={`${emptyStateBg} rounded-xl p-8 transition-colors duration-300`}>
                    <div className="h-64 flex flex-col items-center justify-center text-center">
                        <div className={`w-20 h-20 ${emptyStateIconBg} rounded-full flex items-center justify-center mb-4`}>
                            <FiBarChart2 className={`w-10 h-10 ${emptyStateIconColor}`} />
                        </div>
                        <p className={emptyStateText}>No spending data available</p>
                        <p className={`text-sm ${emptyStateSubtext} mt-2`}>
                            Add transactions to see your spending trends over time
                        </p>
                        <div className="flex gap-2 justify-center mt-4">
                            <button
                                className={`px-3 py-1.5 text-xs rounded-lg transition-colors duration-200 ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => {
                                    // You can add a prop to open add transaction modal
                                    console.log('Add transaction clicked');
                                }}
                            >
                                + Add Transaction
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate summary stats
    const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
    const totalExpense = data.reduce((sum, d) => sum + d.expense, 0);
    const totalSavings = totalIncome - totalExpense;
    const avgSavingsRate = totalIncome > 0 ? (totalSavings / totalIncome * 100) : 0;

    return (
        <div className={`space-y-6 ${cardBg} rounded-2xl p-6 shadow-sm border transition-colors duration-300`}>
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`text-lg font-semibold ${cardTitle}`}>Spending Trends</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        Track your income and expenses over time
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${totalSavings >= 0
                    ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                    : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                    }`}>
                    {totalSavings >= 0 ? 'Net Saver' : 'Net Spender'}
                </div>
            </div>

            {/* Month Range Selector */}
            {availableMonths.length > 0 && (
                <div className="space-y-4">
                    <div className="flex gap-4 items-center flex-wrap">
                        <div className="flex-1 min-w-[150px]">
                            <label className={`block text-sm font-medium ${labelText} mb-1`}>Start Month</label>
                            <select
                                value={startMonth}
                                onChange={(e) => setStartMonth(e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${selectBg} ${selectFocus}`}
                            >
                                <option value="all">Earliest</option>
                                {availableMonths.map(month => (
                                    <option key={month.key} value={month.key}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className={`block text-sm font-medium ${labelText} mb-1`}>End Month</label>
                            <select
                                value={endMonth}
                                onChange={(e) => setEndMonth(e.target.value)}
                                className={`w-full border rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${selectBg} ${selectFocus}`}
                            >
                                <option value="all">Latest</option>
                                {availableMonths.map(month => (
                                    <option key={month.key} value={month.key}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className={`${summaryBg} rounded-lg p-3 text-center transition-colors duration-300`}>
                    <p className={`text-xs ${summaryText}`}>Total Income</p>
                    <p className={`text-lg font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        {formatCurrency(totalIncome)}
                    </p>
                </div>
                <div className={`${summaryBg} rounded-lg p-3 text-center transition-colors duration-300`}>
                    <p className={`text-xs ${summaryText}`}>Total Expenses</p>
                    <p className={`text-lg font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        {formatCurrency(totalExpense)}
                    </p>
                </div>
                <div className={`${summaryBg} rounded-lg p-3 text-center transition-colors duration-300`}>
                    <p className={`text-xs ${summaryText}`}>Avg. Savings Rate</p>
                    <p className={`text-lg font-semibold ${totalSavings >= 0
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : isDark ? 'text-red-400' : 'text-red-600'
                        }`}>
                        {avgSavingsRate.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} horizontal={false} />
                        <XAxis
                            type="number"
                            tickFormatter={(value) => `$${value / 1000}k`}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: chartAxisTick, fontSize: 11 }}
                        />
                        <YAxis
                            type="category"
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            width={80}
                            tick={{ fill: chartAxisTick, fontSize: 11, fontWeight: 500 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{
                                color: isDark ? '#9CA3AF' : '#6B7280',
                                fontSize: '12px'
                            }}
                        />
                        <Bar
                            dataKey="income"
                            fill={chartIncomeFill}
                            radius={[0, 4, 4, 0]}
                            name="Income"
                            barSize={20}
                        />
                        <Bar
                            dataKey="expense"
                            fill={chartExpenseFill}
                            radius={[0, 4, 4, 0]}
                            name="Expenses"
                            barSize={20}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Show selected period summary */}
            {(startMonth !== 'all' || endMonth !== 'all') && (
                <div className={`text-center text-xs ${summaryText} ${summaryBg} py-2 rounded-lg transition-colors duration-300`}>
                    Showing data from {data[0].month} to {data[data.length - 1].month} ({data.length} month{data.length !== 1 ? 's' : ''})
                </div>
            )}
        </div>
    );
}