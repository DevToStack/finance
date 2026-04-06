'use client';

import { useFinance } from '@/context/FinanceContext';
import StatsCard from '@/components/cards/StatsCard';
import ExpensePieChart from '@/components/charts/ExpensePieChart';
import BalanceTrendChart from '../charts/balanceChart';
import RecentTransactions from '@/components/tables/RecentTransactions';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart, FiAlertTriangle, FiAlertCircle, FiCheckCircle, FiInfo, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import SpendingTrendsChart from '../charts/SpendingTrendsChart';
import {
    StatsCardSkeleton,
    ChartSkeleton,
    PieChartSkeleton,
    BudgetOverviewSkeleton,
    RecentTransactionsSkeleton
} from '@/components/skeletons/DashboardSkeletons';
import { useMemo, useState } from 'react';

export default function OverviewTab() {
    const {
        totalBalance,
        totalIncome,
        totalExpense,
        loading,
        allTransactions,
        selectedDateRange
    } = useFinance();

    const [showAlert, setShowAlert] = useState(true);

    // Calculate previous month's data for comparison
    const previousMonthData = useMemo(() => {
        const currentStart = new Date(selectedDateRange.start);
        const currentEnd = new Date(selectedDateRange.end);

        const prevMonthStart = new Date(currentStart);
        prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);

        const prevMonthEnd = new Date(currentEnd);
        prevMonthEnd.setMonth(prevMonthEnd.getMonth() - 1);

        const prevMonthTransactions = allTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.transaction_date);
            return transactionDate >= prevMonthStart && transactionDate <= prevMonthEnd;
        });

        const prevIncome = prevMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const prevExpense = prevMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const prevBalance = prevIncome - prevExpense;

        return {
            balance: prevBalance,
            income: prevIncome,
            expense: prevExpense,
            hasData: prevMonthTransactions.length > 0
        };
    }, [allTransactions, selectedDateRange]);

    // Calculate expense comparison and get alert level
    const getExpenseAlertLevel = (currentExpense, previousExpense) => {
        if (previousExpense === 0) return { level: 'info', message: 'No previous data', icon: FiInfo, color: 'text-blue-500' };

        const percentageChange = ((currentExpense - previousExpense) / previousExpense) * 100;

        if (percentageChange > 100) {
            return {
                level: 'critical',
                message: `⚠️ CRITICAL: Expenses increased by ${percentageChange.toFixed(1)}%! Immediate action needed!`,
                icon: FiAlertTriangle,
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                borderColor: 'border-red-500'
            };
        } else if (percentageChange > 60) {
            return {
                level: 'danger',
                message: `🔴 DANGER: Expenses increased by ${percentageChange.toFixed(1)}%! Review your spending urgently!`,
                icon: FiAlertTriangle,
                color: 'text-red-500',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-400'
            };
        } else if (percentageChange > 30) {
            return {
                level: 'warning',
                message: `⚠️ WARNING: Expenses increased by ${percentageChange.toFixed(1)}%! Consider reducing unnecessary expenses.`,
                icon: FiAlertCircle,
                color: 'text-orange-500',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-400'
            };
        } else if (percentageChange > 10) {
            return {
                level: 'caution',
                message: `📈 CAUTION: Expenses increased by ${percentageChange.toFixed(1)}%! Monitor your spending closely.`,
                icon: FiInfo,
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-400'
            };
        } else if (percentageChange < -30) {
            return {
                level: 'excellent',
                message: `🎉 EXCELLENT: Expenses decreased by ${Math.abs(percentageChange).toFixed(1)}%! Great job saving money!`,
                icon: FiCheckCircle,
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                borderColor: 'border-green-500'
            };
        } else if (percentageChange < -10) {
            return {
                level: 'good',
                message: `✅ GOOD: Expenses decreased by ${Math.abs(percentageChange).toFixed(1)}%! Keep up the good work!`,
                icon: FiCheckCircle,
                color: 'text-green-500',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-400'
            };
        } else if (percentageChange < 0) {
            return {
                level: 'positive',
                message: `👍 POSITIVE: Expenses decreased by ${Math.abs(percentageChange).toFixed(1)}%! Small improvement.`,
                icon: FiTrendingDown,
                color: 'text-teal-500',
                bgColor: 'bg-teal-50',
                borderColor: 'border-teal-400'
            };
        } else if (percentageChange === 0) {
            return {
                level: 'stable',
                message: `📊 STABLE: Expenses remained the same as last month.`,
                icon: FiInfo,
                color: 'text-gray-500',
                bgColor: 'bg-gray-50',
                borderColor: 'border-gray-400'
            };
        } else {
            return {
                level: 'mild',
                message: `📈 MILD INCREASE: Expenses up by ${percentageChange.toFixed(1)}% - within acceptable range.`,
                icon: FiArrowUp,
                color: 'text-orange-400',
                bgColor: 'bg-orange-50',
                borderColor: 'border-orange-300'
            };
        }
    };

    // Calculate percentage changes
    const calculateChange = (current, previous, type = 'default') => {
        if (previous === 0) {
            return {
                value: current > 0 ? '+100%' : current < 0 ? '-100%' : '0%',
                type: 'neutral',
                icon: null
            };
        }

        const change = ((current - previous) / Math.abs(previous)) * 100;
        const formattedValue = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;

        let icon = null;
        let changeType = change >= 0 ? 'positive' : 'negative';

        // For expenses, positive change is bad (red), negative change is good (green)
        if (type === 'expense') {
            if (change > 0) {
                icon = FiArrowUp;
                changeType = 'negative'; // Bad for expenses
            } else if (change < 0) {
                icon = FiArrowDown;
                changeType = 'positive'; // Good for expenses
            }
        } else {
            if (change > 0) {
                icon = FiArrowUp;
                changeType = 'positive';
            } else if (change < 0) {
                icon = FiArrowDown;
                changeType = 'negative';
            }
        }

        return {
            value: formattedValue,
            type: changeType,
            icon: icon,
            rawChange: change
        };
    };

    // Calculate savings rate and its change
    const currentSavingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    const previousSavingsRate = previousMonthData.income > 0
        ? ((previousMonthData.income - previousMonthData.expense) / previousMonthData.income) * 100
        : 0;

    const expenseAlert = getExpenseAlertLevel(totalExpense, previousMonthData.expense);
    const balanceChange = calculateChange(totalBalance, previousMonthData.balance);
    const incomeChange = calculateChange(totalIncome, previousMonthData.income);
    const expenseChange = calculateChange(totalExpense, previousMonthData.expense, 'expense');
    const savingsRateChange = calculateChange(currentSavingsRate, previousSavingsRate);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                </div>
                <ChartSkeleton />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PieChartSkeleton />
                    <ChartSkeleton title={false} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BudgetOverviewSkeleton />
                    <RecentTransactionsSkeleton />
                </div>
            </div>
        );
    }

    const stats = [
        {
            title: 'Total Balance',
            value: totalBalance,
            icon: FiDollarSign,
            color: totalBalance >= 0 ? 'bg-green-500' : 'bg-red-500',
            change: balanceChange.value,
            changeType: balanceChange.type,
            changeIcon: balanceChange.icon
        },
        {
            title: 'Total Income',
            value: totalIncome,
            icon: FiTrendingUp,
            color: 'bg-blue-500',
            change: incomeChange.value,
            changeType: incomeChange.type,
            changeIcon: incomeChange.icon
        },
        {
            title: 'Total Expenses',
            value: totalExpense,
            icon: FiTrendingDown,
            color: 'bg-red-500',
            change: expenseChange.value,
            changeType: 'negative', // Always show as negative for expenses
            changeIcon: expenseChange.icon,
            alert: expenseAlert // Add alert data for expense card
        },
        {
            title: 'Savings Rate',
            value: currentSavingsRate,
            icon: FiPieChart,
            color: currentSavingsRate >= 20 ? 'bg-green-500' : currentSavingsRate >= 10 ? 'bg-yellow-500' : 'bg-red-500',
            isPercentage: true,
            change: savingsRateChange.value,
            changeType: savingsRateChange.type,
            changeIcon: savingsRateChange.icon
        }
    ];

    return (
        <div className="space-y-6">
            {/* Expense Alert Banner - Only show if expense increase is significant */}
            {showAlert && (expenseAlert.level === 'critical' || expenseAlert.level === 'danger' || expenseAlert.level === 'warning') && (
                <div className={`${expenseAlert.bgColor} border-l-4 ${expenseAlert.borderColor} p-4 rounded-lg shadow-sm transition-all duration-300`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                            <expenseAlert.icon className={`${expenseAlert.color} text-xl mt-0.5`} />
                            <div>
                                <h3 className={`font-semibold ${expenseAlert.color}`}>
                                    {expenseAlert.level.toUpperCase()} Alert
                                </h3>
                                <p className="text-gray-700 mt-1">{expenseAlert.message}</p>
                                <div className="mt-2 flex space-x-3">
                                    <button
                                        onClick={() => {
                                            // Scroll to expense breakdown
                                            document.querySelector('.expense-breakdown')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                                    >
                                        View Expense Details →
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <BalanceTrendChart />

            {/* Expense Breakdown with warning indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="expense-breakdown">
                    <ExpensePieChart />
                </div>
                <SpendingTrendsChart />
            </div>

            {/* Budget Overview & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetOverview />
                <RecentTransactions />
            </div>

            {/* Optional: Quick Tips Banner based on expense behavior */}
            {expenseChange.rawChange > 30 && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-start space-x-3">
                        <FiAlertCircle className="text-orange-500 text-xl mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-orange-800">💡 Smart Saving Tip</h4>
                            <p className="text-gray-700 text-sm mt-1">
                                Your expenses have increased by {expenseChange.rawChange.toFixed(1)}% compared to last month.
                                Try reviewing your subscriptions, eating out less, or comparing prices before shopping.
                                Small changes can lead to big savings!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Positive Reinforcement Banner */}
            {expenseChange.rawChange < -20 && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start space-x-3">
                        <FiCheckCircle className="text-green-500 text-xl mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-green-800">🌟 Great Job!</h4>
                            <p className="text-gray-700 text-sm mt-1">
                                You've reduced your expenses by {Math.abs(expenseChange.rawChange).toFixed(1)}% compared to last month!
                                Keep up the excellent financial habits. Consider investing or saving the extra money!
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}