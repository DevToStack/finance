// app/dashboard/page.js
"use client";
import dynamic from 'next/dynamic';
import { FiTrendingUp, FiPieChart, FiTarget, FiList } from 'react-icons/fi';
import { ClientOnly } from '@/components/ClientProviders';
import { SummaryCardsSkeleton, ChartSkeleton, InsightsSkeleton } from '@/components/Skeletons';

// Dynamically import client components with SSR disabled
const SummaryCards = dynamic(() => import('@/components/SummaryCards'), {
    ssr: false,
    loading: () => <SummaryCardsSkeleton />
});

const BalanceTrendChart = dynamic(() => import('@/components/BalanceTrendChart'), {
    ssr: false,
    loading: () => <ChartSkeleton />
});

const IncomeExpenseChart = dynamic(() => import('@/components/IncomeExpenseChart'), {
    ssr: false,
    loading: () => <ChartSkeleton />
});

const BudgetTracking = dynamic(() => import('@/components/BudgetTracking'), {
    ssr: false,
    loading: () => <ChartSkeleton />
});

const SpendingBreakdown = dynamic(() => import('@/components/SpendingBreakdown'), {
    ssr: false,
    loading: () => <ChartSkeleton />
});

const InsightsSection = dynamic(() => import('@/components/InsightsSection'), {
    ssr: false,
    loading: () => <InsightsSkeleton />
});

const TransactionsList = dynamic(() => import('@/components/TransactionsList'), {
    ssr: false,
    loading: () => <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
});

export default function OverviewPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Overview</h1>
                <p className="text-[hsl(var(--muted-foreground))] mt-1">
                    Welcome back! Here is your financial snapshot.
                </p>
            </div>

            {/* Summary Cards */}
            <SummaryCards />

            {/* Analytics Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <FiTrendingUp className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                    <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Analytics</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BalanceTrendChart />
                    <IncomeExpenseChart />
                </div>
            </section>

            {/* Budget, Spending & Insights Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <FiPieChart className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                    <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Budget, Spending & Insights</h2>
                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Budget Tracking - Full width on mobile, spans appropriately on larger screens */}
                    <div className="lg:col-span-1">
                        <BudgetTracking />
                    </div>

                    {/* Spending & Insights Container */}
                    <div className="space-y-4 sm:space-y-6 md:col-span-2 lg:col-span-2">
                        <SpendingBreakdown />
                        <InsightsSection />
                    </div>
                </div>
            </section>

            {/* Recent Transactions */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <FiList className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                    <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Recent Transactions</h2>
                </div>
                <TransactionsList limit={10} />
            </section>
        </div>
    );
}