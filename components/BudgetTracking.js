// components/BudgetTracking.js
"use client";
import { useMemo, useState, useEffect } from 'react';
import {
    FiTarget, FiAlertCircle, FiCheckCircle, FiTrendingUp,
    FiDollarSign, FiEdit2, FiPlus, FiMoreVertical,
    FiArrowUp, FiArrowDown, FiCalendar, FiChevronRight
} from 'react-icons/fi';
import useStore from '@/lib/store';

function BudgetProgressBar({ category, spent, limit, color, onEdit, index }) {
    const percentage = Math.min((spent / limit) * 100, 100);
    const isOverBudget = spent > limit;
    const isWarning = percentage >= 80 && !isOverBudget;
    const remaining = limit - spent;
    const [isHovered, setIsHovered] = useState(false);

    const getStatusColor = () => {
        if (isOverBudget) return 'text-red-500';
        if (isWarning) return 'text-yellow-500';
        return 'text-green-500';
    };

    const getProgressColor = () => {
        if (isOverBudget) return 'bg-red-500';
        if (isWarning) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-start justify-between gap-4">
                {/* Left section - Category info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color || '#3b82f6' }}
                        />
                        <span className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                            {category}
                        </span>
                        {(isOverBudget || isWarning) && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${isOverBudget
                                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                    : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                }`}>
                                <FiAlertCircle className="w-2.5 h-2.5" />
                                {isOverBudget ? 'Over' : 'Near limit'}
                            </span>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="relative mb-2">
                        <div className="h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-[hsl(var(--muted-foreground))]">
                            <span className="font-medium text-[hsl(var(--foreground))]">${spent.toLocaleString()}</span> spent
                        </span>
                        <span className="text-[hsl(var(--border))]">•</span>
                        <span className="text-[hsl(var(--muted-foreground))]">
                            of <span className="font-medium text-[hsl(var(--foreground))]">${limit.toLocaleString()}</span>
                        </span>
                        {!isOverBudget && (
                            <>
                                <span className="text-[hsl(var(--border))]">•</span>
                                <span className="text-green-600 dark:text-green-400 font-medium">
                                    ${remaining.toLocaleString()} left
                                </span>
                            </>
                        )}
                        {isOverBudget && (
                            <>
                                <span className="text-[hsl(var(--border))]">•</span>
                                <span className="text-red-600 dark:text-red-400 font-medium">
                                    ${Math.abs(remaining).toLocaleString()} over
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Right section - Percentage and action */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                        <div className={`text-base font-semibold ${getStatusColor()}`}>
                            {percentage.toFixed(0)}%
                        </div>
                        <div className="text-[10px] text-[hsl(var(--muted-foreground))]">
                            used
                        </div>
                    </div>
                    <button
                        onClick={() => onEdit(category)}
                        className={`p-1.5 rounded-md transition-all duration-200 ${isHovered
                                ? 'opacity-100 bg-[hsl(var(--accent))]'
                                : 'opacity-0'
                            }`}
                    >
                        <FiMoreVertical className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BudgetTracking() {
    const [mounted, setMounted] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [timeRange, setTimeRange] = useState('month');
    const [expandedView, setExpandedView] = useState(false);
    const { transactions, budgets } = useStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const budgetData = useMemo(() => {
        if (!mounted) return [];

        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        const spendingByCategory = transactions
            .filter(t => {
                const date = new Date(t.date);
                return t.type === 'expense' && date >= startDate && date <= now;
            })
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        return budgets.map(budget => ({
            ...budget,
            spent: spendingByCategory[budget.category] || 0,
            remaining: budget.limit - (spendingByCategory[budget.category] || 0),
            percentage: ((spendingByCategory[budget.category] || 0) / budget.limit) * 100,
            status: (spendingByCategory[budget.category] || 0) > budget.limit ? 'over' :
                (spendingByCategory[budget.category] || 0) >= budget.limit * 0.9 ? 'danger' :
                    (spendingByCategory[budget.category] || 0) >= budget.limit * 0.8 ? 'warning' : 'good'
        })).sort((a, b) => b.percentage - a.percentage);
    }, [transactions, budgets, mounted, timeRange]);

    if (!mounted) return <BudgetSkeleton />;
    if (budgetData.length === 0) return <EmptyBudgetState />;

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgetData.reduce((sum, b) => sum + b.spent, 0);
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const onTrackCount = budgetData.filter(b => b.status === 'good').length;
    const warningCount = budgetData.filter(b => b.status === 'warning' || b.status === 'danger').length;
    const overCount = budgetData.filter(b => b.status === 'over').length;

    const displayedBudgets = expandedView ? budgetData : budgetData.slice(0, 5);

    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
            {/* Header - Minimal */}
            <div className="p-5 border-b border-[hsl(var(--border))]">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <FiTarget className="w-5 h-5 text-indigo-500" />
                        <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">Budgets</h3>
                    </div>

                    {/* Time range selector - Minimal */}
                    <div className="flex gap-0.5 p-0.5 bg-[hsl(var(--muted))] rounded-lg">
                        {['month', 'quarter', 'year'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all capitalize ${timeRange === range
                                        ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm'
                                        : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats - Clean grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div>
                        <div className="text-xl font-bold text-[hsl(var(--foreground))]">
                            ${totalSpent.toLocaleString()}
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">Total spent</div>
                    </div>
                    <div>
                        <div className={`text-xl font-bold ${overallPercentage > 100 ? 'text-red-500' : 'text-[hsl(var(--foreground))]'}`}>
                            {Math.min(overallPercentage, 999).toFixed(0)}%
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">Utilized</div>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-green-600">
                            {onTrackCount}
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">On track</div>
                    </div>
                    <div>
                        <div className={`text-xl font-bold ${overCount > 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                            {overCount + warningCount}
                        </div>
                        <div className="text-xs text-[hsl(var(--muted-foreground))]">At risk</div>
                    </div>
                </div>

                {/* Overall progress - Minimal */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[hsl(var(--muted-foreground))]">Overall progress</span>
                        <span className="font-medium text-[hsl(var(--foreground))]">
                            {Math.min(overallPercentage, 100).toFixed(0)}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${overallPercentage > 100 ? 'bg-red-500' :
                                    overallPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Budget List - Clean and minimal */}
            <div className="divide-y divide-[hsl(var(--border))]">
                {displayedBudgets.map((budget, index) => (
                    <div key={budget.category} className="p-4 hover:bg-[hsl(var(--accent))]/30 transition-colors">
                        <BudgetProgressBar
                            category={budget.category}
                            spent={budget.spent}
                            limit={budget.limit}
                            color={budget.color}
                            index={index}
                            onEdit={() => setSelectedCategory(budget.category)}
                        />
                    </div>
                ))}
            </div>

            {/* Show more/less button */}
            {budgetData.length > 5 && (
                <button
                    onClick={() => setExpandedView(!expandedView)}
                    className="w-full p-3 text-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-colors border-t border-[hsl(var(--border))]"
                >
                    {expandedView ? (
                        <span className="flex items-center justify-center gap-1">
                            Show less <FiChevronRight className="w-4 h-4 rotate-90" />
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-1">
                            Show {budgetData.length - 5} more budgets <FiChevronRight className="w-4 h-4" />
                        </span>
                    )}
                </button>
            )}

            {/* Quick actions - Minimal */}
            <div className="p-4 bg-[hsl(var(--muted))]/30 border-t border-[hsl(var(--border))]">
                <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-[hsl(var(--foreground))]/5 hover:bg-[hsl(var(--foreground))]/10 rounded-lg transition-colors">
                        <FiTrendingUp className="w-4 h-4" />
                        <span className="hidden sm:inline">Analytics</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
                        <FiPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">New Budget</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Minimal Skeleton
function BudgetSkeleton() {
    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
            <div className="p-5 space-y-4">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-1">
                            <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
            </div>
            <div className="divide-y divide-[hsl(var(--border))]">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 space-y-2">
                        <div className="flex justify-between">
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Minimal Empty State
function EmptyBudgetState() {
    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl mb-3">
                <FiTarget className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-1">No budgets yet</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                Create your first budget to track spending
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors">
                <FiPlus className="w-4 h-4" />
                Create Budget
            </button>
        </div>
    );
}