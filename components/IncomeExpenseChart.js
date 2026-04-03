// components/IncomeExpenseChart.js
"use client";
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useStore from '@/lib/store';

export default function IncomeExpenseChart() {
    const { transactions } = useStore();

    const chartData = useMemo(() => {
        const now = new Date();
        const months = [];
        
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                month: d.toLocaleDateString('en-US', { month: 'short' }),
                year: d.getFullYear(),
                monthIndex: d.getMonth(),
                fullYear: d.getFullYear()
            });
        }

        return months.map(m => {
            const monthTransactions = transactions.filter(t => {
                const date = new Date(t.date);
                return date.getMonth() === m.monthIndex && date.getFullYear() === m.fullYear;
            });

            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                month: m.month,
                income: Math.round(income),
                expense: Math.round(expense),
                savings: Math.round(income - expense)
            };
        });
    }, [transactions]);

    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">Income vs Expenses</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        Monthly comparison for the last 6 months
                    </p>
                </div>
            </div>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                        <XAxis 
                            dataKey="month" 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={12}
                            tickFormatter={(value) => `$${value}`}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value, name) => [`$${value.toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                        />
                        <Legend 
                            wrapperStyle={{ paddingTop: '20px' }}
                            iconType="circle"
                        />
                        <Bar 
                            dataKey="income" 
                            name="Income" 
                            fill="#10b981" 
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                        <Bar 
                            dataKey="expense" 
                            name="Expenses" 
                            fill="#ef4444" 
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
