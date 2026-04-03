// components/InsightsSection.js
"use client";
import { FiTrendingUp, FiAlertCircle, FiBarChart2 } from 'react-icons/fi';
import useStore from '@/lib/store';

export default function InsightsSection() {
    const { transactions } = useStore();

    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const highestCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthExpenses = transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'expense' && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'expense' && date.getMonth() === currentMonth - 1 && date.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyChange = lastMonthExpenses === 0 ? 0 : ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome === 0 ? 0 : ((totalIncome - totalExpenses) / totalIncome * 100);

    const insights = [
        {
            title: 'Highest Spending Category',
            value: highestCategory ? `${highestCategory[0]}` : 'N/A',
            subtext: highestCategory ? `$${highestCategory[1].toLocaleString()}` : 'No data',
            icon: FiBarChart2,
            color: 'text-orange-500',
        },
        {
            title: 'Monthly Comparison',
            value: monthlyChange === 0 ? 'No previous data' : `${monthlyChange > 0 ? '+' : ''}${monthlyChange.toFixed(1)}%`,
            subtext: `vs last month ($${thisMonthExpenses.toLocaleString()} this month)`,
            icon: FiTrendingUp,
            color: monthlyChange > 0 ? 'text-red-500' : 'text-green-500',
        },
        {
            title: 'Savings Rate',
            value: `${savingsRate.toFixed(1)}%`,
            subtext: `of total income saved`,
            icon: FiAlertCircle,
            color: savingsRate > 20 ? 'text-green-500' : savingsRate > 0 ? 'text-yellow-500' : 'text-red-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight) => (
                <div
                    key={insight.title}
                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">{insight.title}</p>
                            <p className="text-2xl font-semibold mt-1 text-[hsl(var(--foreground))]">{insight.value}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{insight.subtext}</p>
                        </div>
                        <insight.icon className={`w-5 h-5 ${insight.color}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}