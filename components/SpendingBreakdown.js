// components/SpendingBreakdown.js
"use client";
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { FiPieChart, FiTrendingUp, FiChevronRight } from 'react-icons/fi';
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

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
        <g>
            <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="hsl(var(--foreground))" className="text-sm font-semibold">
                {payload.name}
            </text>
            <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="hsl(var(--foreground))" className="text-lg font-bold">
                ${value.toLocaleString()}
            </text>
            <text x={cx} y={cy + 25} dy={8} textAnchor="middle" fill="hsl(var(--muted-foreground))" className="text-xs">
                {`${(percent * 100).toFixed(1)}%`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                opacity={0.9}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 4}
                outerRadius={outerRadius + 8}
                fill={fill}
            />
        </g>
    );
};

export default function SpendingBreakdown() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [view, setView] = useState('chart'); // 'chart' or 'list'
    const { transactions } = useStore();

    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const totalExpenses = Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0);

    const pieData = Object.entries(expensesByCategory)
        .map(([name, value]) => ({
            name,
            value,
            percentage: (value / totalExpenses) * 100
        }))
        .sort((a, b) => b.value - a.value);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    if (pieData.length === 0) {
        return <EmptySpendingState />;
    }

    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Header */}
            <div className="p-6 border-b border-[hsl(var(--border))]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                            <FiPieChart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Spending Breakdown</h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                Total Expenses: <span className="font-semibold text-[hsl(var(--foreground))]">
                                    ${totalExpenses.toLocaleString()}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex gap-1 p-1 bg-[hsl(var(--muted))] rounded-lg">
                        <button
                            onClick={() => setView('chart')}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${view === 'chart'
                                    ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm'
                                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                                }`}
                        >
                            Chart
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${view === 'list'
                                    ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm'
                                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                                }`}
                        >
                            List
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[hsl(var(--muted))]/30 rounded-lg">
                        <div className="text-2xl font-bold text-[hsl(var(--foreground))]">
                            {pieData.length}
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Active Categories</div>
                    </div>
                    <div className="text-center p-3 bg-[hsl(var(--muted))]/30 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {pieData[0]?.percentage.toFixed(0)}%
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))] mt-1">Largest Category</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {view === 'chart' ? (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                    onClick={(data, index) => setActiveIndex(index)}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke="hsl(var(--card))"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => (
                                        <span className="text-sm text-[hsl(var(--foreground))]">{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {pieData.map((category, index) => (
                            <div
                                key={category.name}
                                className="flex items-center justify-between p-3 hover:bg-[hsl(var(--accent))] rounded-lg transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="font-medium text-[hsl(var(--foreground))]">{category.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-semibold text-[hsl(var(--foreground))]">
                                            ${category.value.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                            {category.percentage.toFixed(1)}%
                                        </div>
                                    </div>
                                    <FiChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Insights Footer */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-t border-[hsl(var(--border))]">
                <div className="flex items-center gap-2 text-sm">
                    <FiTrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-[hsl(var(--foreground))]">
                        Top category: <span className="font-semibold">{pieData[0]?.name}</span>
                        accounts for {pieData[0]?.percentage.toFixed(0)}% of spending
                    </span>
                </div>
            </div>
        </div>
    );
}

function EmptySpendingState() {
    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl mb-4">
                <FiPieChart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">No Spending Data</h3>
            <p className="text-[hsl(var(--muted-foreground))]">
                Add some expense transactions to see your spending breakdown.
            </p>
        </div>
    );
}