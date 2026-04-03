// components/SummaryCards.js
"use client";
import { useMemo, useEffect, useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCreditCard, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import useStore from '@/lib/store';
import Sparkline from './ui/Sparkline';

function SummaryCard({ title, value, icon: Icon, color, bgColor, trend, trendValue, sparklineData, subtitle }) {
    const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-[hsl(var(--muted-foreground))]';
    const TrendIcon = trend === 'up' ? FiArrowUpRight : trend === 'down' ? FiArrowDownRight : null;

    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 hover:shadow-lg hover:border-[hsl(var(--ring))] transition-all duration-300">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{title}</p>
                        {trend && TrendIcon && (
                            <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
                                <TrendIcon className="w-3 h-3" />
                                {trendValue}
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold mt-2 text-[hsl(var(--foreground))]">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${bgColor}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
            {sparklineData && sparklineData.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <Sparkline data={sparklineData} trend={trend} />
                </div>
            )}
        </div>
    );
}

export default function SummaryCards() {
    const [mounted, setMounted] = useState(false);
    const { transactions } = useStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const stats = useMemo(() => {
        // Return default stats if not mounted yet (SSR phase)
        if (!mounted) {
            return {
                totalBalance: 0,
                currentIncome: 0,
                currentExpenses: 0,
                savings: 0,
                savingsRate: 0,
                incomeChange: 0,
                expenseChange: 0,
                sparklineData: [],
                incomeSparkline: [],
                expenseSparkline: []
            };
        }

        // Your existing calculation logic here...
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const currentMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const lastMonthTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
        });

        const currentIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentExpenses = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const lastIncome = lastMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const lastExpenses = lastMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0) -
            transactions.filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

        const savings = currentIncome - currentExpenses;
        const savingsRate = currentIncome > 0 ? (savings / currentIncome) * 100 : 0;

        const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;
        const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;

        const dailyBalances = [];
        let runningBalance = 0;

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

        const dailyIncomeData = [];
        const dailyExpenseData = [];

        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayTransactions = transactions.filter(t => t.date === dateStr);
            const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const dayExpense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

            dailyIncomeData.push(dayIncome);
            dailyExpenseData.push(dayExpense);
        }

        return {
            totalBalance,
            currentIncome,
            currentExpenses,
            savings,
            savingsRate,
            incomeChange,
            expenseChange,
            sparklineData: dailyBalances,
            incomeSparkline: dailyIncomeData,
            expenseSparkline: dailyExpenseData
        };
    }, [transactions, mounted]);

    // Don't render anything during SSR
    if (!mounted) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6 animate-pulse">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: 'Total Balance',
            value: `$${stats.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: FiCreditCard,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
            trend: stats.totalBalance >= 0 ? 'up' : 'down',
            trendValue: `${stats.savingsRate.toFixed(1)}%`,
            sparklineData: stats.sparklineData,
            subtitle: 'Net worth across all accounts'
        },
        {
            title: 'Monthly Income',
            value: `$${stats.currentIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: FiTrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950/30',
            trend: stats.incomeChange >= 0 ? 'up' : 'down',
            trendValue: `${Math.abs(stats.incomeChange).toFixed(1)}%`,
            sparklineData: stats.incomeSparkline,
            subtitle: 'vs last month'
        },
        {
            title: 'Monthly Expenses',
            value: `$${stats.currentExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: FiTrendingDown,
            color: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-950/30',
            trend: stats.expenseChange <= 0 ? 'up' : 'down',
            trendValue: `${Math.abs(stats.expenseChange).toFixed(1)}%`,
            sparklineData: stats.expenseSparkline,
            subtitle: 'vs last month'
        },
        {
            title: 'Monthly Savings',
            value: `$${stats.savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: FiDollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950/30',
            trend: stats.savings >= 0 ? 'up' : 'down',
            trendValue: `${stats.savingsRate.toFixed(1)}%`,
            sparklineData: null,
            subtitle: 'of total income saved'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <SummaryCard key={card.title} {...card} />
            ))}
        </div>
    );
}