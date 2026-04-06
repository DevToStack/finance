"use client";

import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { useState, useEffect } from 'react';
import { FiAlertCircle, FiTrendingUp, FiTrendingDown, FiPieChart, FiBarChart2, FiDollarSign } from 'react-icons/fi';

export default function BudgetProgressChart() {
    const { budgets, getBudgetProgress } = useFinance();
    const { isDark } = useTheme();
    const [isMobile, setIsMobile] = useState(false);
    const [chartType, setChartType] = useState('bar');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const chartData = budgets.map(budget => {
        const progress = getBudgetProgress(budget.category);
        if (!progress) return null;

        const percentage = progress.amount > 0 ? (progress.spent / progress.amount) * 100 : 0;

        return {
            category: budget.category,
            budget: budget.amount,
            spent: progress.spent,
            remaining: Math.max(0, progress.remaining),
            isOverBudget: progress.isOverBudget,
            percentage: Math.min(percentage, 100)
        };
    }).filter(Boolean).sort((a, b) => b.percentage - a.percentage);

    // Theme-based classes
    const cardBg = isDark ? 'bg-gray-950/50 border border-gray-800' : 'bg-white border-gray-100';
    const borderColor = isDark ? 'border-gray-800' : 'border-gray-100';
    const textPrimary = isDark ? 'text-white' : 'text-gray-800';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const textTertiary = isDark ? 'text-gray-500' : 'text-gray-400';
    const emptyStateText = isDark ? 'text-gray-400' : 'text-gray-500';
    const tooltipBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100';
    const tooltipText = isDark ? 'text-gray-300' : 'text-gray-600';
    const tooltipLabel = isDark ? 'text-white' : 'text-gray-800';
    const mobileCardBg = isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100';
    const mobileCardText = isDark ? 'text-white' : 'text-gray-800';
    const statusBadge = {
        over: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700',
        near: isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
        good: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
    };
    const progressBarBg = isDark ? 'bg-gray-700' : 'bg-gray-200';
    const summaryCard = {
        blue: isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
        red: isDark ? 'bg-red-900/20 border-red-800' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
        green: isDark ? 'bg-green-900/20 border-green-800' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
    };
    const summaryText = {
        blue: isDark ? 'text-blue-300' : 'text-blue-800',
        blueDark: isDark ? 'text-blue-100' : 'text-blue-900',
        red: isDark ? 'text-red-300' : 'text-red-800',
        redDark: isDark ? 'text-red-100' : 'text-red-900',
        green: isDark ? 'text-green-300' : 'text-green-800',
        greenDark: isDark ? 'text-green-100' : 'text-green-900'
    };
    const warningBg = isDark ? 'bg-gradient-to-r from-red-900/20 to-orange-900/20 border-red-700' : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-500';
    const warningText = isDark ? 'text-red-300' : 'text-red-700';
    const warningTitle = isDark ? 'text-red-200' : 'text-red-800';
    const toggleBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
    const toggleBtnActive = isDark ? 'bg-gray-700 text-white' : 'bg-white shadow-sm text-gray-800';
    const toggleBtnInactive = isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700';
    const scrollHint = isDark ? 'text-gray-500' : 'text-gray-400';
    const emptyStateIconBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
    const emptyStateIconColor = isDark ? 'text-gray-600' : 'text-gray-400';

    // Empty state with icons
    if (chartData.length === 0) {
        return (
            <div className={`${cardBg} rounded-xl shadow-sm p-6 `}>
                <h3 className={`text-lg font-semibold mb-4 ${textPrimary}`}>Budget Progress</h3>
                <div className="h-80 flex flex-col items-center justify-center text-center">
                    <div className={`w-20 h-20 ${emptyStateIconBg} rounded-full flex items-center justify-center mb-4`}>
                        <FiBarChart2 className={`w-10 h-10 ${emptyStateIconColor}`} />
                    </div>
                    <p className={`${emptyStateText} mb-2`}>No budget data available</p>
                    <p className={`text-sm ${textTertiary}`}>Set some budgets to see your progress!</p>
                </div>
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className={`${tooltipBg} p-3 md:p-4 rounded-lg shadow-lg border min-w-[200px] `}>
                    <p className={`font-semibold ${tooltipLabel} mb-2 text-sm md:text-base`}>{label}</p>
                    <div className="space-y-1 text-xs md:text-sm">
                        <p className="flex justify-between gap-3">
                            <span className={tooltipText}>Budget:</span>
                            <span className={`font-semibold ${textPrimary}`}>{formatCurrency(data.budget)}</span>
                        </p>
                        <p className="flex justify-between gap-3">
                            <span className={tooltipText}>Spent:</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">{formatCurrency(data.spent)}</span>
                        </p>
                        <p className="flex justify-between gap-3">
                            <span className={tooltipText}>Remaining:</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(data.remaining)}</span>
                        </p>
                        <p className={`flex justify-between gap-3 pt-1 border-t mt-1 ${borderColor}`}>
                            <span className={tooltipText}>Usage:</span>
                            <span className={`font-semibold ${data.isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                {data.percentage.toFixed(1)}%
                            </span>
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Mobile compact view
    const MobileCompactView = () => (
        <div className="space-y-3">
            {chartData.map((item, index) => (
                <div key={index} className={`${mobileCardBg} rounded-lg p-3 border `}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className={`font-semibold ${mobileCardText} text-sm`}>{item.category}</h4>
                            <p className={`text-xs ${textSecondary} mt-0.5`}>
                                {item.percentage.toFixed(1)}% used
                            </p>
                        </div>
                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.isOverBudget ? statusBadge.over :
                            item.percentage >= 80 ? statusBadge.near :
                                statusBadge.good
                            }`}>
                            {item.isOverBudget ? 'Over' : item.percentage >= 80 ? 'Near Limit' : 'Good'}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className={`h-2 ${progressBarBg} rounded-full overflow-hidden`}>
                            <div
                                className={`h-full rounded-full ${item.isOverBudget ? 'bg-red-500' :
                                    item.percentage >= 80 ? 'bg-yellow-500' :
                                        'bg-blue-500'
                                    }`}
                                style={{ width: `${Math.min(item.percentage, 100)}%` }}
                            />
                        </div>

                        <div className="flex justify-between text-xs">
                            <div>
                                <span className={textSecondary}>Spent:</span>
                                <span className={`font-semibold ${textPrimary} ml-1`}>{formatCurrency(item.spent)}</span>
                            </div>
                            <div>
                                <span className={textSecondary}>of:</span>
                                <span className={`font-semibold ${textPrimary} ml-1`}>{formatCurrency(item.budget)}</span>
                            </div>
                        </div>

                        {item.isOverBudget && (
                            <div className={`${isDark ? 'bg-red-900/20' : 'bg-red-50'} rounded-md p-2 mt-2`}>
                                <p className={`${isDark ? 'text-red-300' : 'text-red-700'} text-xs flex items-center gap-1`}>
                                    <FiAlertCircle className="w-3 h-3" />
                                    Over budget by {formatCurrency(item.spent - item.budget)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    // Responsive chart based on screen size
    const ResponsiveBarChart = () => {
        const isSmallScreen = isMobile;

        return (
            <div className="w-full overflow-x-auto">
                <div style={{ minWidth: isSmallScreen ? '600px' : '100%', height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout={isSmallScreen ? "horizontal" : "vertical"}
                            margin={{
                                top: 20,
                                right: isSmallScreen ? 10 : 30,
                                left: isSmallScreen ? 0 : 10,
                                bottom: isSmallScreen ? 60 : 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
                            {isSmallScreen ? (
                                <>
                                    <XAxis
                                        dataKey="category"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                        tick={{ fontSize: 10, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                                        interval={0}
                                    />
                                    <YAxis
                                        type="number"
                                        tickFormatter={(value) => `$${value / 1000}k`}
                                        tick={{ fontSize: 10, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                                    />
                                </>
                            ) : (
                                <>
                                    <XAxis
                                        type="number"
                                        tickFormatter={(value) => formatCurrency(value)}
                                        tick={{ fontSize: 11, fill: isDark ? '#9CA3AF' : '#6B7280' }}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="category"
                                        width={100}
                                        tick={{ fontSize: 11, fontWeight: 500, fill: isDark ? '#D1D5DB' : '#374151' }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                </>
                            )}
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                wrapperStyle={{ fontSize: '12px', color: isDark ? '#9CA3AF' : '#6B7280' }}
                                iconType="circle"
                            />
                            <Bar dataKey="budget" fill={isDark ? '#60A5FA' : '#3B82F6'} name="Budget" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="spent" fill={isDark ? '#F87171' : '#EF4444'} name="Spent" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.isOverBudget ? (isDark ? '#DC2626' : '#DC2626') : (isDark ? '#F87171' : '#EF4444')}
                                        opacity={entry.isOverBudget ? 1 : 0.7}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    };

    return (
        <div className={`${cardBg} rounded-xl shadow-sm p-4 md:p-6 `}>
            {/* Header with view toggle for mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
                <h3 className={`text-base md:text-lg font-semibold ${textPrimary}`}>Budget Progress by Category</h3>

                {/* View toggle for mobile */}
                {isMobile && (
                    <div className={`flex gap-2 ${toggleBg} rounded-lg p-1 w-full sm:w-auto`}>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium ${chartType === 'bar' ? toggleBtnActive : toggleBtnInactive
                                }`}
                        >
                            Chart
                        </button>
                        <button
                            onClick={() => setChartType('compact')}
                            className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium ${chartType === 'compact' ? toggleBtnActive : toggleBtnInactive
                                }`}
                        >
                            List
                        </button>
                    </div>
                )}
            </div>

            {/* Chart or Compact View */}
            {isMobile && chartType === 'compact' ? (
                <MobileCompactView />
            ) : (
                <ResponsiveBarChart />
            )}

            {/* Summary Cards - Responsive Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-6 pt-4 ${borderColor} border-t`}>
                <div className={`${summaryCard.blue} rounded-lg p-3 md:p-4 border `}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs md:text-sm ${summaryText.blue} font-medium`}>Total Budget</p>
                            <p className={`text-lg md:text-2xl font-bold ${summaryText.blueDark}`}>
                                {formatCurrency(chartData.reduce((sum, d) => sum + d.budget, 0))}
                            </p>
                        </div>
                        <FiPieChart className={`w-6 h-6 md:w-8 md:h-8 ${isDark ? 'text-blue-400' : 'text-blue-400'}`} />
                    </div>
                </div>

                <div className={`${summaryCard.red} rounded-lg p-3 md:p-4 border `}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs md:text-sm ${summaryText.red} font-medium`}>Total Spent</p>
                            <p className={`text-lg md:text-2xl font-bold ${summaryText.redDark}`}>
                                {formatCurrency(chartData.reduce((sum, d) => sum + d.spent, 0))}
                            </p>
                        </div>
                        <FiTrendingUp className={`w-6 h-6 md:w-8 md:h-8 ${isDark ? 'text-red-400' : 'text-red-400'}`} />
                    </div>
                </div>

                <div className={`${summaryCard.green} rounded-lg p-3 md:p-4 border sm:col-span-2 lg:col-span-1 `}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs md:text-sm ${summaryText.green} font-medium`}>Total Remaining</p>
                            <p className={`text-lg md:text-2xl font-bold ${summaryText.greenDark}`}>
                                {formatCurrency(chartData.reduce((sum, d) => sum + d.remaining, 0))}
                            </p>
                        </div>
                        <FiTrendingDown className={`w-6 h-6 md:w-8 md:h-8 ${isDark ? 'text-green-400' : 'text-green-400'}`} />
                    </div>
                </div>
            </div>

            {/* Warning Alert - Responsive */}
            {chartData.some(d => d.isOverBudget) && (
                <div className={`mt-4 ${warningBg} border-l-4 rounded-lg p-3 md:p-4 shadow-sm `}>
                    <div className="flex items-start gap-2 md:gap-3">
                        <FiAlertCircle className={`w-4 h-4 md:w-5 md:h-5 ${warningText} flex-shrink-0 mt-0.5`} />
                        <div>
                            <p className={`text-xs md:text-sm font-semibold ${warningTitle}`}>
                                Budget Alert
                            </p>
                            <p className={`text-xs md:text-sm ${warningText}`}>
                                {chartData.filter(d => d.isOverBudget).length} categor{chartData.filter(d => d.isOverBudget).length === 1 ? 'y is' : 'ies are'} over budget!
                                Consider reviewing your spending in these categories.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile-specific bottom padding for better scrolling */}
            {isMobile && chartType === 'bar' && (
                <div className={`text-center text-xs ${scrollHint} mt-4`}>
                    ← Scroll horizontally to see more →
                </div>
            )}
        </div>
    );
}