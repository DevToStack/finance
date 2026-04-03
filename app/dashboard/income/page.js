// app/dashboard/income/page.js
"use client";
import { useMemo, useState, useEffect } from 'react';
import { FiTrendingUp, FiPlus, FiDownload } from 'react-icons/fi';
import useStore from '@/lib/store';
import TransactionsList from '@/components/TransactionsList';
import IncomeExpenseChart from '@/components/IncomeExpenseChart';
import SummaryCards from '@/components/SummaryCards';

export default function IncomePage() {
    const [mounted, setMounted] = useState(false);
    const { transactions, getFilteredTransactions, exportToCSV } = useStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const incomeStats = useMemo(() => {
        if (!mounted) {
            return {
                currentIncome: 0,
                lastIncome: 0,
                incomeChange: 0,
                topSources: [],
                transactionCount: 0
            };
        }

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.type === 'income';
        });

        const lastMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear && t.type === 'income';
        });

        const currentIncome = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
        const lastIncome = lastMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
        const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;

        // Top income sources
        const incomeByCategory = {};
        currentMonthTransactions.forEach(t => {
            incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
        });
        const topSources = Object.entries(incomeByCategory)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return {
            currentIncome,
            lastIncome,
            incomeChange,
            topSources,
            transactionCount: currentMonthTransactions.length
        };
    }, [transactions, mounted]);

    const handleExport = () => {
        const incomeTransactions = transactions.filter(t => t.type === 'income');
        exportToCSV(incomeTransactions);
    };

    // Show skeleton loader during SSR
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
                            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Income</h1>
                    <p className="text-[hsl(var(--muted-foreground))] mt-1">
                        Track and manage your income sources
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
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-950/30 rounded-lg flex items-center justify-center">
                            <FiTrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">This Month</p>
                            <p className="text-xl font-bold text-[hsl(var(--foreground))]" suppressHydrationWarning>
                                ${incomeStats.currentIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm">
                        <span className={`${incomeStats.incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {incomeStats.incomeChange >= 0 ? '+' : ''}{incomeStats.incomeChange.toFixed(1)}%
                        </span>
                        <span className="text-[hsl(var(--muted-foreground))]">vs last month</span>
                    </div>
                </div>

                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                            <FiTrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Transactions</p>
                            <p className="text-xl font-bold text-[hsl(var(--foreground))]" suppressHydrationWarning>
                                {incomeStats.transactionCount}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 sm:col-span-2">
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">Top Income Sources</p>
                    <div className="space-y-2">
                        {incomeStats.topSources.map(([category, amount]) => (
                            <div key={category} className="flex items-center justify-between">
                                <span className="text-sm text-[hsl(var(--foreground))]">{category}</span>
                                <span className="text-sm font-medium text-green-600">
                                    ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))}
                        {incomeStats.topSources.length === 0 && (
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">No income this month</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <IncomeExpenseChart />

            {/* Transactions */}
            <div>
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Income Transactions</h2>
                <TransactionsList filterType="income" />
            </div>
        </div>
    );
}