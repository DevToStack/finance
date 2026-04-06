"use client";

import { useFinance } from '@/context/FinanceContext';
import StatsCard from '@/components/cards/StatsCard';
import ExpensePieChart from '@/components/charts/ExpensePieChart';
import BalanceTrendChart from '../charts/balanceChart';// ← Update this import
import RecentTransactions from '@/components/tables/RecentTransactions';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart } from 'react-icons/fi';
import SpendingTrendsChart from '../charts/SpendingTrendsChart';
import {
    StatsCardSkeleton,
    ChartSkeleton,
    PieChartSkeleton,
    BudgetOverviewSkeleton,
    RecentTransactionsSkeleton
} from '@/components/skeletons/DashboardSkeletons';


export default function OverviewTab() {
    const { totalBalance, totalIncome, totalExpense, loading } = useFinance();

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
            color: 'bg-green-500',
            change: '+12.5%',
            changeType: 'positive'
        },
        {
            title: 'Total Income',
            value: totalIncome,
            icon: FiTrendingUp,
            color: 'bg-blue-500',
            change: '+8.2%',
            changeType: 'positive'
        },
        {
            title: 'Total Expenses',
            value: totalExpense,
            icon: FiTrendingDown,
            color: 'bg-red-500',
            change: '-3.1%',
            changeType: 'negative'
        },
        {
            title: 'Savings Rate',
            value: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
            icon: FiPieChart,
            color: 'bg-purple-500',
            isPercentage: true,
            change: '+5.4%',
            changeType: 'positive'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <BalanceTrendChart />

            {/* Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpensePieChart />
                <SpendingTrendsChart />
            </div>

            {/* Budget Overview & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetOverview />
                <RecentTransactions />
            </div>
        </div>
    );
}