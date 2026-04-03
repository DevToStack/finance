// app/dashboard/expenses/page.js
"use client";
import { useMemo, useState, useEffect } from 'react';
import { FiTrendingDown, FiDownload } from 'react-icons/fi';
import useStore from '@/lib/store';
import TransactionsList from '@/components/TransactionsList';
import SpendingBreakdown from '@/components/SpendingBreakdown';
import BudgetTracking from '@/components/BudgetTracking';

export default function ExpensesPage() {
    const [mounted, setMounted] = useState(false);
    const { transactions, budgets, exportToCSV } = useStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const expenseStats = useMemo(() => {
        if (!mounted) {
            return {
                currentExpenses: 0,
                lastExpenses: 0,
                expenseChange: 0,
                topCategories: [],
                transactionCount: 0,
                budgetAlerts: 0
            };
        }

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.type === 'expense';
        });

        const lastMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && t.type === 'expense';
        });

        const currentExpenses = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
        const lastExpenses = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
        const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;

        // Top expense categories
        const expenseByCategory = {};
        currentMonthTransactions.forEach(t => {
            expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
        });
        const topCategories = Object.entries(expenseByCategory)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Budget status
        let budgetAlerts = 0;
        budgets.forEach(b => {
            const spent = currentMonthTransactions
                .filter(t => t.category === b.category)
                .reduce((sum, t) => sum + t.amount, 0);
            if ((spent / b.limit) > 0.8) {
                budgetAlerts++;
            }
        });

        return {
            currentExpenses,
            lastExpenses,
            expenseChange,
            topCategories,
            transactionCount: currentMonthTransactions.length,
            budgetAlerts
        };
    }, [transactions, budgets, mounted]);

    const handleExport = () => {
        const expenseTransactions = transactions.filter(t => t.type === 'expense');
        exportToCSV(expenseTransactions);
    };

    // Show skeleton during SSR
    if (!mounted) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
                            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Expenses</h1>
                    <p className="text-[hsl(var(--muted-foreground))] mt-1">
                        Monitor and control your spending
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] rounded-lg text-sm font-medium transition-colors"
                    >
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-950/30 rounded-lg flex items-center justify-center">
                            <FiTrendingDown className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">This Month</p>
                            <p className="text-xl font-bold text-[hsl(var(--foreground))]" suppressHydrationWarning>
                                ${expenseStats.currentExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm">
                        <span className={`${expenseStats.expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {expenseStats.expenseChange >= 0 ? '+' : ''}{expenseStats.expenseChange.toFixed(1)}%
                        </span>
                        <span className="text-[hsl(var(--muted-foreground))]">vs last month</span>
                    </div>
                </div>

                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/30 rounded-lg flex items-center justify-center">
                            <FiTrendingDown className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Transactions</p>
                            <p className="text-xl font-bold text-[hsl(var(--foreground))]" suppressHydrationWarning>
                                {expenseStats.transactionCount}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-950/30 rounded-lg flex items-center justify-center">
                            <FiTrendingDown className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Budget Alerts</p>
                            <p className="text-xl font-bold text-[hsl(var(--foreground))]" suppressHydrationWarning>
                                {expenseStats.budgetAlerts}
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">
                        Categories over 80% limit
                    </p>
                </div>

                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">Top Categories</p>
                    <div className="space-y-2">
                        {expenseStats.topCategories.slice(0, 3).map(([category, amount]) => (
                            <div key={category} className="flex items-center justify-between">
                                <span className="text-sm text-[hsl(var(--foreground))]">{category}</span>
                                <span className="text-sm font-medium text-red-600">
                                    ${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Budget & Spending */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetTracking />
                <SpendingBreakdown />
            </div>

            {/* Transactions */}
            <div>
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Expense Transactions</h2>
                <TransactionsList filterType="expense" />
            </div>
        </div>
    );
}