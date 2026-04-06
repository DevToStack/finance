"use client";

import { useFinance } from '@/context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/utils/formatters';
import {
    FiPieChart,
    FiBarChart2,
    FiDollarSign,
    FiTrendingUp,
    FiCalendar,
    FiClock,
    FiZap,
    FiActivity,
    FiChevronRight
} from 'react-icons/fi';

const COLORS = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#059669', '#047857', '#065F46', '#064E3B'];
const DARK_COLORS = ['#34D399', '#6EE7B7', '#A7F3D0', '#86EFAC', '#10B981', '#059669', '#047857', '#065F46'];

export default function IncomeChart() {
    const { incomeByCategory, monthlyTrends, transactions } = useFinance();
    const [chartType, setChartType] = useState('pie');
    const { isDark } = useTheme();

    // Prepare data for pie chart
    const pieData = incomeByCategory.map(item => ({
        name: item.name,
        value: item.value,
        percentage: (item.value / incomeByCategory.reduce((sum, i) => sum + i.value, 0)) * 100
    }));

    // Prepare data for bar chart (monthly breakdown)
    const latestMonths = monthlyTrends.slice(-6).map(trend => ({
        month: new Date(trend.month.split('-')[0], trend.month.split('-')[1] - 1).toLocaleDateString('en-US', { month: 'short' }),
        income: trend.income
    }));

    // Get recent income transactions
    const recentIncomes = transactions
        ?.filter(t => t.type === 'income')
        ?.sort((a, b) => new Date(b.date) - new Date(a.date))
        ?.slice(0, 5) || [];

    const totalIncome = incomeByCategory.reduce((sum, i) => sum + i.value, 0);

    // Dynamic classes based on theme
    const cardBg = isDark ? 'bg-gray-950/50 border border-gray-900' : 'bg-white border-gray-200';
    const cardHeaderBg = isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100';
    const headerIconBg = isDark ? 'bg-green-900/30' : 'bg-green-50';
    const headerIcon = isDark ? 'text-green-400' : 'text-green-600';
    const headerTitle = isDark ? 'text-white' : 'text-gray-800';
    const headerSubtitle = isDark ? 'text-gray-500' : 'text-gray-500';

    const toggleBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
    const toggleBtnActive = isDark ? 'bg-gray-700 text-green-300' : 'bg-white shadow-sm text-green-700';
    const toggleBtnInactive = isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800';

    const chartBorder = isDark ? 'border-gray-700' : 'border-gray-100';
    const chartText = isDark ? '#9CA3AF' : '#6B7280';
    const chartGrid = isDark ? '#374151' : '#f0f0f0';
    const chartCursor = isDark ? '#374151' : '#f9fafb';

    const categoryChipBg = isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100';
    const categoryChipText = isDark ? 'text-gray-300' : 'text-gray-700';
    const categoryChipPercent = isDark ? 'text-gray-500' : 'text-gray-500';

    const metricCard = {
        total: isDark ? 'bg-gradient-to-br from-green-950/30 to-emerald-950/30' : 'bg-gradient-to-br from-green-50 to-emerald-50',
        totalText: isDark ? 'text-green-300' : 'text-green-700',
        totalValue: isDark ? 'text-green-200' : 'text-green-700',
        sources: isDark ? 'bg-gradient-to-br from-blue-950/30 to-indigo-950/30' : 'bg-gradient-to-br from-blue-50 to-indigo-50',
        sourcesText: isDark ? 'text-blue-300' : 'text-blue-700',
        sourcesValue: isDark ? 'text-blue-200' : 'text-blue-700'
    };

    const rightColumnBg = isDark ? 'bg-gray-950/50' : '';
    const rightColumnTitle = isDark ? 'text-gray-300' : 'text-gray-800';
    const rightColumnBadge = isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-400';
    const recentItemBg = isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100';
    const recentIconBg = isDark ? 'bg-green-900/30' : 'bg-green-100';
    const recentIcon = isDark ? 'text-green-400' : 'text-green-600';
    const recentCategory = isDark ? 'text-white' : 'text-gray-800';
    const recentDesc = isDark ? 'text-gray-400' : 'text-gray-500';
    const recentAmount = isDark ? 'text-green-400' : 'text-green-600';
    const recentDate = isDark ? 'text-gray-500' : 'text-gray-400';
    const viewAllBtn = isDark ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700';

    const emptyStateIconBg = isDark ? 'bg-gray-800' : 'bg-gray-50';
    const emptyStateIcon = isDark ? 'text-gray-600' : 'text-gray-300';
    const emptyStateTitle = isDark ? 'text-gray-300' : 'text-gray-800';
    const emptyStateText = isDark ? 'text-gray-500' : 'text-gray-500';
    const emptyStateCard = isDark ? 'bg-gray-950/50 border border-gray-900' : 'bg-white border-gray-200';

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-3 rounded-lg shadow-lg border`}>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} text-sm`}>{data.name}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Amount: <span className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(data.value)}</span>
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Percentage: <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {data.percentage ? data.percentage.toFixed(1) : ((data.value / totalIncome) * 100).toFixed(1)}%
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (incomeByCategory.length === 0 && recentIncomes.length === 0) {
        return (
            <div className={`${emptyStateCard} rounded-xl border p-8`}>
                <div className="text-center">
                    <div className={`w-16 h-16 ${emptyStateIconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <FiDollarSign className={`w-8 h-8 ${emptyStateIcon}`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${emptyStateTitle} mb-2`}>No income data</h3>
                    <p className={`text-sm ${emptyStateText}`}>Add income transactions to see your income breakdown</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${cardBg} rounded-xl border overflow-hidden shadow-sm`}>
            {/* Header */}
            <div className={`p-5 border-b ${cardHeaderBg}`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 ${headerIconBg} rounded-lg`}>
                            <FiTrendingUp className={`w-5 h-5 ${headerIcon}`} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold ${headerTitle}`}>Income Analysis</h3>
                            <p className={`text-xs ${headerSubtitle} mt-0.5`}>Track your earnings and sources</p>
                        </div>
                    </div>

                    {/* Chart Type Toggle */}
                    <div className={`flex gap-1 ${toggleBg} rounded-lg p-1`}>
                        <button
                            onClick={() => setChartType('pie')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${chartType === 'pie' ? toggleBtnActive : toggleBtnInactive
                                }`}
                        >
                            <FiPieChart className="w-3.5 h-3.5" />
                            Breakdown
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${chartType === 'bar' ? toggleBtnActive : toggleBtnInactive
                                }`}
                        >
                            <FiBarChart2 className="w-3.5 h-3.5" />
                            Trend
                        </button>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {/* Left Column - Chart */}
                <div className="lg:col-span-2 p-5">
                    {incomeByCategory.length > 0 ? (
                        <>
                            {chartType === 'pie' ? (
                                <div>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius={100}
                                                    innerRadius={60}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    paddingAngle={2}
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={isDark ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                    wrapperStyle={{
                                                        fontSize: '12px',
                                                        color: isDark ? '#9CA3AF' : '#6B7280'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Category Summary Chips */}
                                    <div className={`flex flex-wrap gap-2 mt-4 pt-3 border-t ${chartBorder}`}>
                                        {pieData.map((category, index) => (
                                            <div
                                                key={category.name}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 ${categoryChipBg} rounded-lg`}
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: isDark ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length] }}
                                                />
                                                <span className={`text-xs font-medium ${categoryChipText}`}>{category.name}</span>
                                                <span className={`text-xs ${categoryChipPercent}`}>({category.percentage.toFixed(0)}%)</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={latestMonths}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 11, fill: chartText }}
                                                axisLine={{ stroke: chartGrid }}
                                                tickLine={{ stroke: chartGrid }}
                                            />
                                            <YAxis
                                                tickFormatter={(value) => `$${value / 1000}k`}
                                                tick={{ fontSize: 11, fill: chartText }}
                                                axisLine={{ stroke: chartGrid }}
                                                tickLine={{ stroke: chartGrid }}
                                            />
                                            <Tooltip
                                                formatter={(value) => formatCurrency(value)}
                                                cursor={{ fill: chartCursor }}
                                                contentStyle={{
                                                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                                    color: isDark ? '#F3F4F6' : '#111827'
                                                }}
                                            />
                                            <Bar
                                                dataKey="income"
                                                fill={isDark ? '#34D399' : '#10B981'}
                                                radius={[6, 6, 0, 0]}
                                                maxBarSize={60}
                                            >
                                                {latestMonths.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={isDark ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-80 flex items-center justify-center">
                            <div className="text-center">
                                <FiPieChart className={`w-12 h-12 ${emptyStateIcon} mx-auto mb-3`} />
                                <p className={`text-sm ${emptyStateText}`}>Add income to see charts</p>
                            </div>
                        </div>
                    )}

                    {/* Key Metrics */}
                    {incomeByCategory.length > 0 && (
                        <div className={`grid grid-cols-2 gap-3 mt-5 pt-4 border-t ${chartBorder}`}>
                            <div className={`${metricCard.total} rounded-lg p-3`}>
                                <p className={`text-xs ${metricCard.totalText} font-medium mb-1`}>Total Income</p>
                                <p className={`text-xl font-bold ${metricCard.totalValue}`}>
                                    {formatCurrency(totalIncome)}
                                </p>
                            </div>
                            <div className={`${metricCard.sources} rounded-lg p-3`}>
                                <p className={`text-xs ${metricCard.sourcesText} font-medium mb-1`}>Income Sources</p>
                                <p className={`text-xl font-bold ${metricCard.sourcesValue}`}>
                                    {incomeByCategory.length}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Recent Income */}
                <div className={`lg:col-span-1 p-5 ${rightColumnBg}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FiClock className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                            <h4 className={`font-semibold ${rightColumnTitle} text-sm`}>Recent Income</h4>
                        </div>
                        {recentIncomes.length > 0 && (
                            <span className={`text-xs ${rightColumnBadge} px-1.5 py-0.5 rounded-full`}>
                                {recentIncomes.length}
                            </span>
                        )}
                    </div>

                    {recentIncomes.length > 0 ? (
                        <div className="space-y-3">
                            {recentIncomes.map((income, index) => (
                                <div
                                    key={income.id || index}
                                    className={`group p-3 ${recentItemBg} rounded-lg`}
                                >
                                    <div className="flex items-start justify-between mb-1">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-6 h-6 ${recentIconBg} rounded-full flex items-center justify-center`}>
                                                    <FiDollarSign className={`w-3 h-3 ${recentIcon}`} />
                                                </div>
                                                <span className={`font-medium ${recentCategory} text-sm`}>
                                                    {income.category || 'Income'}
                                                </span>
                                            </div>
                                            <p className={`text-xs ${recentDesc} line-clamp-1`}>
                                                {income.description || 'No description'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${recentAmount}`}>
                                                +{formatCurrency(income.amount)}
                                            </p>
                                            <p className={`text-xs ${recentDate} flex items-center gap-0.5 mt-0.5`}>
                                                <FiCalendar className="w-2.5 h-2.5" />
                                                {new Date(income.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* View All Link */}
                            <button className={`w-full mt-2 text-center text-xs ${viewAllBtn} font-medium flex items-center justify-center gap-1 py-2`}>
                                View all transactions
                                <FiChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className={`w-12 h-12 ${emptyStateIconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                                <FiZap className={`w-6 h-6 ${emptyStateIcon}`} />
                            </div>
                            <p className={`text-sm ${emptyStateText} mb-1`}>No recent income</p>
                            <p className={`text-xs ${emptyStateText}`}>Add your first income transaction</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}