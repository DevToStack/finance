// components/BudgetTracking.js
"use client";
import { useMemo, useState, useEffect } from 'react';
import { FiTarget, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import useStore from '@/lib/store';

function BudgetProgressBar({ category, spent, limit, color }) {
    const percentage = Math.min((spent / limit) * 100, 100);
    const isOverBudget = spent > limit;
    const isWarning = percentage >= 80 && !isOverBudget;

    const statusColor = isOverBudget ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500';
    const statusBg = isOverBudget ? 'bg-red-100 dark:bg-red-950/30' : isWarning ? 'bg-yellow-100 dark:bg-yellow-950/30' : 'bg-green-100 dark:bg-green-950/30';
    const StatusIcon = isOverBudget ? FiAlertCircle : isWarning ? FiAlertCircle : FiCheckCircle;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">{category}</span>
                    <StatusIcon className={`w-4 h-4 ${isOverBudget ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-green-500'}`} />
                </div>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                    <span className={isOverBudget ? 'text-red-600 font-medium' : ''}>
                        ${spent.toLocaleString()}
                    </span>
                    <span className="mx-1">/</span>
                    <span>${limit.toLocaleString()}</span>
                </div>
            </div>
            <div className={`h-2 rounded-full ${statusBg} overflow-hidden`}>
                <div
                    className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between text-xs">
                <span className={`${isOverBudget ? 'text-red-600 font-medium' : 'text-[hsl(var(--muted-foreground))]'}`}>
                    {percentage.toFixed(0)}% used
                </span>
                <span className="text-[hsl(var(--muted-foreground))]">
                    ${(limit - spent).toLocaleString()} remaining
                </span>
            </div>
        </div>
    );
}

export default function BudgetTracking() {
    const [mounted, setMounted] = useState(false);
    const { transactions, budgets } = useStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const budgetData = useMemo(() => {
        if (!mounted) return [];

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Calculate spending per category for current month
        const spendingByCategory = transactions
            .filter(t => {
                const date = new Date(t.date);
                return t.type === 'expense' &&
                    date.getMonth() === currentMonth &&
                    date.getFullYear() === currentYear;
            })
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {});

        return budgets.map(budget => ({
            ...budget,
            spent: spendingByCategory[budget.category] || 0
        })).sort((a, b) => (b.spent / b.limit) - (a.spent / a.limit));
    }, [transactions, budgets, mounted]);

    // Don't render during SSR
    if (!mounted) {
        return (
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 animate-pulse">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        <div>
                            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = budgetData.reduce((sum, b) => sum + b.spent, 0);
    const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                        <FiTarget className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Budget Tracking</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            Monthly spending vs budget
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-[hsl(var(--foreground))]" suppressHydrationWarning>
                        {overallPercentage.toFixed(0)}%
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">of total budget used</p>
                </div>
            </div>

            {/* Overall progress */}
            <div className="mb-6">
                <div className="h-3 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${overallPercentage > 100 ? 'bg-red-500' :
                                overallPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                        style={{ width: `${Math.min(overallPercentage, 100)}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                    <span className="text-[hsl(var(--muted-foreground))]">
                        Spent: <span className="font-medium text-[hsl(var(--foreground))]">${totalSpent.toLocaleString()}</span>
                    </span>
                    <span className="text-[hsl(var(--muted-foreground))]">
                        Budget: <span className="font-medium text-[hsl(var(--foreground))]">${totalBudget.toLocaleString()}</span>
                    </span>
                </div>
            </div>

            {/* Category budgets */}
            <div className="space-y-5">
                {budgetData.map((budget) => (
                    <BudgetProgressBar
                        key={budget.category}
                        category={budget.category}
                        spent={budget.spent}
                        limit={budget.limit}
                        color={budget.color}
                    />
                ))}
            </div>
        </div>
    );
}