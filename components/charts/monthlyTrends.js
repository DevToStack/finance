// components/BalanceChart.js
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ComposedChart,
    Legend,
} from 'recharts';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import { FiBarChart2, FiCalendar, FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

export default function BalanceChart() {
    const { allTransactions, loading } = useFinance();
    const { isDark } = useTheme();
    const [chartData, setChartData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dateRange, setDateRange] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [chartView, setChartView] = useState('balance');
    const [animationActive, setAnimationActive] = useState(true);

    // Theme-based classes
    const cardBg = isDark ? 'bg-gray-950 border-gray-900' : 'bg-white border-gray-100';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
    const buttonPrimary = isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600';
    const buttonSecondary = isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    const buttonActive = isDark ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-500 text-white shadow-md';
    const buttonInactive = isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    const inputBg = isDark ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900';
    const pickerBg = isDark ? 'bg-gray-800/50' : 'bg-gray-50';
    const emptyStateIconBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
    const emptyStateIconColor = isDark ? 'text-gray-600' : 'text-gray-400';
    const emptyStateText = isDark ? 'text-gray-400' : 'text-gray-500';
    const emptyStateSubtext = isDark ? 'text-gray-500' : 'text-gray-400';
    const summaryBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const summaryText = isDark ? 'text-gray-400' : 'text-gray-500';
    const loadingSpinnerBorder = isDark ? 'border-blue-400' : 'border-blue-500';
    const loadingText = isDark ? 'text-gray-400' : 'text-gray-500';
    const chartGrid = isDark ? '#374151' : '#e5e7eb';
    const chartText = isDark ? '#9CA3AF' : '#6B7280';

    // Chart colors based on theme
    const chartColors = {
        balance: {
            stroke: isDark ? '#60A5FA' : '#3B82F6',
            gradient: isDark ? '#60A5FA' : '#3B82F6',
        },
        income: {
            stroke: isDark ? '#34D399' : '#10B981',
            gradient: isDark ? '#34D399' : '#10B981',
        },
        expense: {
            stroke: isDark ? '#F87171' : '#EF4444',
            gradient: isDark ? '#F87171' : '#EF4444',
        }
    };

    // Generate chart data from transactions (balance over time)
    const generateChartData = useCallback(() => {
        if (!allTransactions || allTransactions.length === 0) {
            return getDemoData();
        }

        const sorted = [...allTransactions].sort((a, b) =>
            new Date(a.transaction_date) - new Date(b.transaction_date)
        );

        let runningBalance = 0;
        const dailyMap = new Map();

        sorted.forEach(transaction => {
            const date = transaction.transaction_date;
            const amount = parseFloat(transaction.amount);

            if (!dailyMap.has(date)) {
                dailyMap.set(date, { income: 0, expense: 0, balance: 0 });
            }

            const dayData = dailyMap.get(date);
            if (transaction.type === 'income') {
                dayData.income += amount;
                runningBalance += amount;
            } else {
                dayData.expense += amount;
                runningBalance -= amount;
            }
            dayData.balance = runningBalance;
            dailyMap.set(date, dayData);
        });

        const data = Array.from(dailyMap.entries()).map(([date, values]) => ({
            date,
            income: values.income,
            expense: values.expense,
            balance: values.balance,
        }));

        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        return data;
    }, [allTransactions]);

    // Demo data for empty state
    const getDemoData = () => {
        const demo = [];
        const startDate = new Date(2024, 0, 1);
        let balance = 5000;

        for (let i = 0; i < 30; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            const income = Math.random() * 500 + 200;
            const expense = Math.random() * 400 + 100;
            balance = balance + income - expense;

            demo.push({
                date: dateStr,
                income: Math.round(income),
                expense: Math.round(expense),
                balance: Math.round(balance),
            });
        }
        return demo;
    };

    // Filter data based on selected range
    const filterDataByRange = useCallback((data, range, start, end) => {
        if (!data.length) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let startDate = new Date();
        let endDate = new Date();

        switch (range) {
            case 'today':
                startDate = today;
                endDate = today;
                break;
            case 'last7':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 7);
                endDate = today;
                break;
            case 'last30':
                startDate = new Date(today);
                startDate.setDate(today.getDate() - 30);
                endDate = today;
                break;
            case 'custom':
                if (start && end) {
                    startDate = new Date(start);
                    endDate = new Date(end);
                } else {
                    return data;
                }
                break;
            default:
                return data;
        }

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        return data.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
        });
    }, []);

    // Update chart data when transactions change
    useEffect(() => {
        const rawData = generateChartData();
        setChartData(rawData);
    }, [generateChartData]);

    // Apply filters when range or data changes
    useEffect(() => {
        let filtered;
        if (dateRange === 'custom' && customStartDate && customEndDate) {
            filtered = filterDataByRange(chartData, 'custom', customStartDate, customEndDate);
        } else {
            filtered = filterDataByRange(chartData, dateRange);
        }
        setFilteredData(filtered);
        setAnimationActive(true);
        const timer = setTimeout(() => setAnimationActive(false), 1000);
        return () => clearTimeout(timer);
    }, [chartData, dateRange, customStartDate, customEndDate, filterDataByRange]);

    // Custom tooltip component with theme support
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border p-3 transition-colors duration-200`}>
                    <p className={`font-semibold ${textPrimary} mb-2`}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: ${entry.value?.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Format date for x-axis
    const formatXAxis = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // Get chart lines based on view
    const getChartLines = () => {
        switch (chartView) {
            case 'balance':
                return (
                    <>
                        <defs>
                            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColors.balance.gradient} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={chartColors.balance.gradient} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke={chartColors.balance.stroke}
                            strokeWidth={2}
                            fill="url(#balanceGradient)"
                            name="Balance"
                            dot={false}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                            isAnimationActive={animationActive}
                            animationDuration={1000}
                            animationEasing="ease-out"
                        />
                    </>
                );
            case 'income-expense':
                return (
                    <>
                        <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColors.income.gradient} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={chartColors.income.gradient} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColors.expense.gradient} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={chartColors.expense.gradient} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke={chartColors.income.stroke}
                            strokeWidth={2}
                            fill="url(#incomeGradient)"
                            name="Income"
                            dot={false}
                            isAnimationActive={animationActive}
                            animationDuration={1000}
                            animationEasing="ease-out"
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke={chartColors.expense.stroke}
                            strokeWidth={2}
                            fill="url(#expenseGradient)"
                            name="Expense"
                            dot={false}
                            isAnimationActive={animationActive}
                            animationDuration={1000}
                            animationEasing="ease-out"
                        />
                    </>
                );
            case 'all':
                return (
                    <>
                        <defs>
                            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartColors.balance.gradient} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={chartColors.balance.gradient} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke={chartColors.balance.stroke}
                            strokeWidth={2}
                            fill="url(#balanceGradient)"
                            name="Balance"
                            dot={false}
                            isAnimationActive={animationActive}
                            animationDuration={1000}
                            animationEasing="ease-out"
                        />
                        <Line
                            type="monotone"
                            dataKey="income"
                            stroke={chartColors.income.stroke}
                            strokeWidth={2}
                            name="Income"
                            dot={false}
                            isAnimationActive={animationActive}
                            animationDuration={1000}
                        />
                        <Line
                            type="monotone"
                            dataKey="expense"
                            stroke={chartColors.expense.stroke}
                            strokeWidth={2}
                            name="Expense"
                            dot={false}
                            isAnimationActive={animationActive}
                            animationDuration={1000}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    // Filter button component with theme support
    const FilterButton = ({ label, value, active }) => (
        <button
            onClick={() => {
                setDateRange(value);
                if (value !== 'custom') setShowCustomPicker(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${active ? buttonActive : buttonInactive
                }`}
        >
            {label}
        </button>
    );

    // View toggle button with theme support
    const ViewToggle = ({ label, value, active }) => (
        <button
            onClick={() => setChartView(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${active ? buttonActive : buttonInactive
                }`}
        >
            {label}
        </button>
    );

    if (loading) {
        return (
            <div className={`${cardBg} rounded-xl border p-6 transition-colors duration-300`}>
                <div className="flex items-center justify-center h-80">
                    <div className="text-center">
                        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${loadingSpinnerBorder} mx-auto`}></div>
                        <p className={`mt-4 ${loadingText}`}>Loading chart data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${cardBg} rounded-xl border p-6 transition-colors duration-300`}>
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className={`text-lg font-medium ${textPrimary}`}>Financial Overview</h3>

                {/* View Toggles */}
                <div className="flex gap-2 flex-wrap">
                    <ViewToggle label="Balance Only" value="balance" active={chartView === 'balance'} />
                    <ViewToggle label="Income vs Expense" value="income-expense" active={chartView === 'income-expense'} />
                    <ViewToggle label="All Metrics" value="all" active={chartView === 'all'} />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
                <FilterButton label="All Time" value="all" active={dateRange === 'all'} />
                <FilterButton label="Today" value="today" active={dateRange === 'today'} />
                <FilterButton label="Last 7 Days" value="last7" active={dateRange === 'last7'} />
                <FilterButton label="Last 30 Days" value="last30" active={dateRange === 'last30'} />
                <button
                    onClick={() => setShowCustomPicker(!showCustomPicker)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${dateRange === 'custom'
                        ? buttonActive
                        : buttonInactive
                        }`}
                >
                    Custom Range
                </button>
            </div>

            {/* Custom Date Picker */}
            {showCustomPicker && (
                <div className={`${pickerBg} rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-end border ${borderColor} transition-colors duration-300`}>
                    <div>
                        <label className={`block text-sm font-medium ${textPrimary} mb-1`}>Start Date</label>
                        <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                            className={`px-3 py-2 border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} transition-colors duration-200`}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium ${textPrimary} mb-1`}>End Date</label>
                        <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                            className={`px-3 py-2 border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputBg} transition-colors duration-200`}
                        />
                    </div>
                    <button
                        onClick={() => {
                            if (customStartDate && customEndDate) {
                                setDateRange('custom');
                                setShowCustomPicker(false);
                            }
                        }}
                        className={`px-4 py-2 ${buttonPrimary} rounded-lg text-sm font-medium transition-colors duration-200`}
                    >
                        Apply
                    </button>
                </div>
            )}

            {/* Chart Container */}
            <div className="h-80 w-full">
                {filteredData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={filteredData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} strokeOpacity={0.2} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatXAxis}
                                stroke={chartText}
                                fontSize={12}
                                tick={{ fill: chartText }}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                                stroke={chartText}
                                fontSize={12}
                                tick={{ fill: chartText }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                            />
                            {getChartLines()}
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className={`flex items-center justify-center h-full ${isDark ? 'bg-gray-900/30' : 'bg-gray-50'} rounded-lg transition-colors duration-300`}>
                        <div className="text-center">
                            <div className={`w-20 h-20 ${emptyStateIconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <FiBarChart2 className={`w-10 h-10 ${emptyStateIconColor}`} />
                            </div>
                            <p className={emptyStateText}>No data available for selected range</p>
                            <p className={`text-sm ${emptyStateSubtext} mt-2`}>Try adjusting your filters or add some transactions</p>
                            <div className="flex gap-2 justify-center mt-4">
                                <button
                                    onClick={() => setDateRange('last7')}
                                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors duration-200 ${buttonInactive}`}
                                >
                                    Last 7 Days
                                </button>
                                <button
                                    onClick={() => setDateRange('last30')}
                                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors duration-200 ${buttonInactive}`}
                                >
                                    Last 30 Days
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Summary Stats for Filtered Period */}
            {filteredData.length > 0 && (
                <div className={`mt-6 grid grid-cols-3 gap-4 pt-4 border-t ${summaryBorder} transition-colors duration-300`}>
                    <div className="text-center">
                        <p className={`text-xs ${summaryText}`}>Period Income</p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            ${filteredData.reduce((sum, d) => sum + d.income, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className={`text-xs ${summaryText}`}>Period Expense</p>
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                            ${filteredData.reduce((sum, d) => sum + d.expense, 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className={`text-xs ${summaryText}`}>Period Net</p>
                        <p className={`text-lg font-semibold ${filteredData.reduce((sum, d) => sum + d.income - d.expense, 0) >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                            }`}>
                            ${filteredData.reduce((sum, d) => sum + d.income - d.expense, 0).toLocaleString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}