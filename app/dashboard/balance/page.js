// app/dashboard/balance/page.js
"use client";
import { useMemo, useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiDownload } from 'react-icons/fi';
import useStore from '@/lib/store';
import BalanceTrendChart from '@/components/BalanceTrendChart';
import TransactionsList from '@/components/TransactionsList';
import SummaryCards from '@/components/SummaryCards';

export default function BalancePage() {
    const [mounted, setMounted] = useState(false);
    const { transactions, exportToCSV } = useStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const balanceStats = useMemo(() => {
        if (!mounted) {
            return {
                totalBalance: 0,
                balanceChange: 0,
                dailyBalances: [],
                monthlyData: []
            };
        }

        const now = new Date();

        // Calculate total balance
        const totalBalance = transactions.reduce((sum, t) => {
            return t.type === 'income' ? sum + t.amount : sum - t.amount;
        }, 0);

        // Calculate 30-day trend
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
        const balance30DaysAgo = transactions
            .filter(t => new Date(t.date) < thirtyDaysAgo)
            .reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0);

        const balanceChange = balance30DaysAgo !== 0
            ? ((totalBalance - balance30DaysAgo) / Math.abs(balance30DaysAgo)) * 100
            : 0;

        // Daily balance for sparkline
        const dailyBalances = [];
        let runningBalance = balance30DaysAgo;

        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayTransactions = transactions.filter(t => t.date === dateStr);
            const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const dayExpense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

            runningBalance += (dayIncome - dayExpense);
            dailyBalances.push(runningBalance);
        }

        // Monthly breakdown
        const monthlyData = {};
        transactions.forEach(t => {
            const date = new Date(t.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyData[key]) {
                monthlyData[key] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                monthlyData[key].income += t.amount;
            } else {
                monthlyData[key].expense += t.amount;
            }
        });

        return {
            totalBalance,
            balanceChange,
            dailyBalances,
            monthlyData: Object.entries(monthlyData).slice(-6)
        };
    }, [transactions, mounted]);

    const handleExport = () => {
        exportToCSV();
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
                    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 sm:col-span-3">
                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Balance</h1>
                    <p className="text-[hsl(var(--muted-foreground))] mt-1">
                        Track your net worth and financial trends
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
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                            <FiDollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Balance</p>
                            <p className="text-xl font-bold text-[hsl(var(--foreground))]" suppressHydrationWarning>
                                ${balanceStats.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm">
                        <span className={`${balanceStats.balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {balanceStats.balanceChange >= 0 ? '+' : ''}{balanceStats.balanceChange.toFixed(1)}%
                        </span>
                        <span className="text-[hsl(var(--muted-foreground))]">last 30 days</span>
                    </div>
                </div>

                <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 sm:col-span-3">
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">Monthly Breakdown (Last 6 Months)</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                        {balanceStats.monthlyData.map(([month, data]) => {
                            const [year, monthNum] = month.split('-');
                            const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { month: 'short' });
                            const net = data.income - data.expense;
                            return (
                                <div key={month} className="text-center">
                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{monthName}</p>
                                    <p className={`text-sm font-semibold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${net.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Balance Chart */}
            <BalanceTrendChart />

            {/* Recent Transactions */}
            <div>
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">All Transactions</h2>
                <TransactionsList />
            </div>
        </div>
    );
}