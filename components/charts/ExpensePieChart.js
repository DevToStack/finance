"use client";

import { useFinance } from '@/context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

// Distinct, vibrant color palette for categories (same for both themes, but will adapt via opacity)
const COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#D946EF', // Fuchsia
    '#F43F5E', // Rose
    '#0EA5E9', // Sky
    '#A855F7', // Violet
];

// Dark mode color palette (slightly brighter for better visibility)
const DARK_COLORS = [
    '#60A5FA', // Blue-400
    '#34D399', // Emerald-400
    '#FBBF24', // Amber-400
    '#F87171', // Red-400
    '#A78BFA', // Purple-400
    '#F472B6', // Pink-400
    '#22D3EE', // Cyan-400
    '#A3E635', // Lime-400
    '#FB923C', // Orange-400
    '#818CF8', // Indigo-400
    '#2DD4BF', // Teal-400
    '#E879F9', // Fuchsia-400
    '#FB7185', // Rose-400
    '#38BDF8', // Sky-400
    '#C084FC', // Violet-400
];

// Minimal tooltip with theme support
const CustomTooltip = ({ active, payload, isDark }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-[0_8px_30px_rgb(0,0,0,0.12)] border px-3 py-2 rounded-md`}>
                <p className={`text-xs font-mono ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide`}>{data.name}</p>
                <p className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-black'} mt-1`}>
                    ${data.value.toFixed(2)}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                    {(data.percent * 100).toFixed(1)}%
                </p>
            </div>
        );
    }
    return null;
};

export default function ExpensePieChart() {
    const { expenseByCategory } = useFinance();
    const [activeCategory, setActiveCategory] = useState(null);
    const { isDark } = useTheme();

    // Process data
    const processedData = useMemo(() => {
        if (!expenseByCategory.length) return [];

        const total = expenseByCategory.reduce((sum, item) => sum + item.value, 0);

        return expenseByCategory
            .filter(item => item.value > 0)
            .map(item => ({
                ...item,
                percent: item.value / total
            }))
            .sort((a, b) => b.value - a.value);
    }, [expenseByCategory]);

    const totalExpenses = useMemo(() =>
        processedData.reduce((sum, item) => sum + item.value, 0),
        [processedData]
    );

    // Dynamic classes based on theme
    const cardBg = isDark ? 'bg-gray-950/50 border-gray-900' : 'bg-white border-gray-100';
    const emptyStateBg = isDark ? 'bg-gray-800' : 'bg-white';
    const emptyStateIconBg = isDark ? 'bg-gray-700' : 'bg-gray-50';
    const emptyStateIcon = isDark ? 'text-gray-500' : 'text-gray-300';
    const emptyStateTitle = isDark ? 'text-gray-200' : 'text-gray-900';
    const emptyStateText = isDark ? 'text-gray-500' : 'text-gray-400';

    const headerTitle = isDark ? 'text-gray-200' : 'text-gray-900';
    const headerAmount = isDark ? 'text-white' : 'text-black';
    const headerLabel = isDark ? 'text-gray-500' : 'text-gray-400';
    const headerCount = isDark ? 'text-gray-500' : 'text-gray-400';

    const chartStroke = isDark ? '#1F2937' : '#FFFFFF';
    const dividerBorder = isDark ? 'border-gray-700' : 'border-gray-50';
    const categoryHover = isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50';
    const categoryDot = isDark ? 'ring-1 ring-gray-700' : '';
    const categoryName = isDark ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-black';
    const categoryAmount = isDark ? 'text-gray-200' : 'text-gray-900';
    const categoryPercent = isDark ? 'text-gray-500' : 'text-gray-400';

    const insightBg = isDark ? 'bg-gray-700/30 border-gray-700' : 'bg-gray-50/30 border-gray-50';
    const insightText = isDark ? 'text-gray-500' : 'text-gray-400';
    const insightHighlight = isDark ? 'text-gray-300' : 'text-gray-600';

    if (processedData.length === 0) {
        return (
            <div className={`${emptyStateBg} border ${cardBg} rounded-lg p-12 `}>
                <div className="flex flex-col items-center justify-center text-center w-full h-full">
                    <div className={`w-12 h-12 ${emptyStateIconBg} rounded-full flex items-center justify-center mb-4`}>
                        <svg className={`w-6 h-6 ${emptyStateIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className={`font-medium ${emptyStateTitle} mb-1`}>No expenses recorded</h3>
                    <p className={`text-sm ${emptyStateText}`}>Add your first expense to see the breakdown</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${cardBg} border rounded-lg overflow-hidden `}>
            {/* Header - Vercel style */}
            <div className="px-6 pt-6 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`font-medium ${headerTitle}`}>
                            Expenses
                        </h3>
                        <p className={`text-3xl font-semibold ${headerAmount} mt-1 tracking-tight`}>
                            ${totalExpenses.toFixed(2)}
                        </p>
                        <p className={`text-xs font-mono ${headerLabel} mt-0.5`}>
                            TOTAL SPENT
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={`text-xs font-mono ${headerCount}`}>
                            {processedData.length} CATEGORIES
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart - Minimal donut */}
            <div className="px-6 py-4">
                <div className="h-[280px] sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={processedData}
                                cx="50%"
                                cy="50%"
                                innerRadius="65%"
                                outerRadius="85%"
                                paddingAngle={2}
                                dataKey="value"
                                nameKey="name"
                                onMouseEnter={(_, index) => setActiveCategory(processedData[index].name)}
                                onMouseLeave={() => setActiveCategory(null)}
                                stroke={chartStroke}
                                strokeWidth={2}
                                animationDuration={500}
                            >
                                {processedData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={isDark ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]}
                                        className="cursor-pointer"
                                        style={{
                                            opacity: activeCategory && activeCategory !== entry.name ? 0.3 : 1,
                                        }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={(props) => <CustomTooltip {...props} isDark={isDark} />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Categories - Clean list */}
            <div className={`border-t ${dividerBorder}`}>
                <div className={`divide-y ${dividerBorder}`}>
                    {processedData.map((category, idx) => (
                        <div
                            key={idx}
                            className={`px-6 py-3 ${categoryHover}  cursor-pointer group`}
                            onMouseEnter={() => setActiveCategory(category.name)}
                            onMouseLeave={() => setActiveCategory(null)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-2.5 h-2.5 rounded-full ${categoryDot}`}
                                        style={{ backgroundColor: isDark ? DARK_COLORS[idx % DARK_COLORS.length] : COLORS[idx % COLORS.length] }}
                                    />
                                    <span className={`text-sm ${categoryName} `}>
                                        {category.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-sm font-mono ${categoryAmount}`}>
                                        ${category.value.toFixed(2)}
                                    </span>
                                    <span className={`text-xs font-mono ${categoryPercent} w-12 text-right`}>
                                        {Math.round(category.percent * 100)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subtle insight - optional */}
            {processedData.length > 1 && (
                <div className={`px-6 py-3 ${insightBg} border-t ${dividerBorder}`}>
                    <p className={`text-xs font-mono ${insightText}`}>
                        Largest category · <span className={insightHighlight}>{processedData[0].name}</span>
                        <span className="mx-1">·</span>
                        {Math.round(processedData[0].percent * 100)}% of total
                    </p>
                </div>
            )}
        </div>
    );
}