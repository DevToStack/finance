// components/SpendingBreakdown.js
"use client";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, LabelList } from 'recharts';
import { FiPieChart, FiTrendingUp, FiChevronRight, FiBarChart2 } from 'react-icons/fi';
import useStore from '@/lib/store';

const COLORS = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#d946ef'
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-lg p-3">
                <p className="font-semibold text-[hsl(var(--foreground))] mb-1">{data.name}</p>
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
                    ${data.value.toLocaleString()}
                </p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {data.percentage.toFixed(1)}% of total expenses
                </p>
            </div>
        );
    }
    return null;
};

// Custom label renderer for bar values
const renderCustomizedLabel = (props, isMobile) => {
    const { x, y, width, value } = props;
    const formattedValue = isMobile ? `$${(value / 1000).toFixed(0)}k` : `$${value.toLocaleString()}`;

    return (
        <text
            x={x + width - 8}
            y={y + 22}
            fill="#fff"
            textAnchor="end"
            fontSize={isMobile ? 10 : 12}
            fontWeight="bold"
        >
            {formattedValue}
        </text>
    );
};

export default function SpendingBreakdown() {
    const [view, setView] = useState('chart');
    const [isMobile, setIsMobile] = useState(false);
    const { transactions } = useStore();

    // Check screen size for responsive adjustments
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const totalExpenses = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0);

    const barData = Object.entries(expensesByCategory)
        .map(([name, value]) => ({
            name: name.length > (isMobile ? 12 : 20) ? name.substring(0, isMobile ? 10 : 18) + '...' : name,
            fullName: name,
            value,
            percentage: (value / totalExpenses) * 100
        }))
        .sort((a, b) => b.value - a.value);

    if (barData.length === 0) {
        return <EmptySpendingState />;
    }

    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[hsl(var(--border))]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg flex-shrink-0">
                            <FiBarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-[hsl(var(--foreground))]">Spending Breakdown</h3>
                            <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">
                                Total Expenses: <span className="font-semibold text-[hsl(var(--foreground))]">
                                    ${totalExpenses.toLocaleString()}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex gap-1 p-1 bg-[hsl(var(--muted))] rounded-lg self-start sm:self-auto">
                        <button
                            onClick={() => setView('chart')}
                            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-all ${view === 'chart'
                                ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm'
                                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                                }`}
                        >
                            Chart
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-md transition-all ${view === 'list'
                                ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm'
                                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                                }`}
                        >
                            List
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center p-2 sm:p-3 bg-[hsl(var(--muted))]/30 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-[hsl(var(--foreground))]">
                            {barData.length}
                        </div>
                        <div className="text-[10px] sm:text-xs text-[hsl(var(--muted-foreground))] mt-1">Active Categories</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-[hsl(var(--muted))]/30 rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">
                            {barData[0]?.percentage.toFixed(0)}%
                        </div>
                        <div className="text-[10px] sm:text-xs text-[hsl(var(--muted-foreground))] mt-1">Largest Category</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {view === 'chart' ? (
                    <div className="h-80 sm:h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barData}
                                layout="vertical"
                                margin={{ top: 10, right: isMobile ? 30 : 50, left: isMobile ? 0 : 0, bottom: 0 }}
                                barSize={isMobile ? 25 : 35}
                                barGap={4}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border))"
                                    horizontal={false}
                                />
                                <XAxis
                                    type="number"
                                    tick={false}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={[0, 'dataMax + (dataMax * 0.1)']}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={isMobile ? 80 : 110}
                                    stroke="hsl(var(--muted-foreground))"
                                    tick={{
                                        fill: 'hsl(var(--foreground))',
                                        fontSize: isMobile ? 11 : 13,
                                        fontWeight: 500
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--accent))', opacity: 0.3 }} />
                                <Bar
                                    dataKey="value"
                                    name="Amount Spent"
                                    radius={[0, 6, 6, 0]}
                                    label={(props) => {
                                        const { x, y, width, value } = props;
                                        const formattedValue = isMobile
                                            ? `$${(value / 1000).toFixed(0)}k`
                                            : `$${value.toLocaleString()}`;

                                        // Only show label if bar is wide enough
                                        if (width < 50) return null;

                                        return (
                                            <text
                                                x={x + width - 8}
                                                y={y + (isMobile ? 18 : 22)}
                                                fill="#ffffff"
                                                textAnchor="end"
                                                fontSize={isMobile ? 10 : 12}
                                                fontWeight="bold"
                                            >
                                                {formattedValue}
                                            </text>
                                        );
                                    }}
                                >
                                    {barData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
                        {barData.map((category, index) => (
                            <div
                                key={category.fullName}
                                className="flex items-center justify-between p-2 sm:p-3 hover:bg-[hsl(var(--accent))] rounded-lg transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                    <div
                                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="font-medium text-[hsl(var(--foreground))] text-sm sm:text-base truncate">
                                        {category.fullName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                    <div className="text-right">
                                        <div className="font-semibold text-[hsl(var(--foreground))] text-sm sm:text-base">
                                            ${category.value.toLocaleString()}
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-[hsl(var(--muted-foreground))]">
                                            {category.percentage.toFixed(1)}%
                                        </div>
                                    </div>
                                    <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Insights Footer */}
            <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-t border-[hsl(var(--border))]">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <FiTrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-[hsl(var(--foreground))]">
                        Top category: <span className="font-semibold mr-1">{barData[0]?.fullName}</span>
                        accounts for {barData[0]?.percentage.toFixed(0)}% of spending
                    </span>
                </div>
            </div>
        </div>
    );
}

function EmptySpendingState() {
    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl mb-4">
                <FiBarChart2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[hsl(var(--foreground))] mb-2">No Spending Data</h3>
            <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))]">
                Add some expense transactions to see your spending breakdown.
            </p>
        </div>
    );
}