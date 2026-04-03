// components/BalanceTrendChart.js
"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import useStore from '@/lib/store';

export default function BalanceTrendChart() {
    const { transactions } = useStore();

    // Group by date and calculate daily balance
    const dailyData = transactions.reduce((acc, t) => {
        const date = t.date;
        if (!acc[date]) {
            acc[date] = { date, balance: 0, income: 0, expense: 0 };
        }
        if (t.type === 'income') {
            acc[date].balance += t.amount;
            acc[date].income += t.amount;
        } else {
            acc[date].balance -= t.amount;
            acc[date].expense += t.amount;
        }
        return acc;
    }, {});

    let runningBalance = 0;
    const chartData = Object.values(dailyData)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(d => {
            runningBalance += d.balance;
            return { ...d, runningBalance };
        });

    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4 text-[hsl(var(--foreground))]">Balance Trend</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--foreground))'
                            }}
                            formatter={(value) => [`$${value}`, 'Balance']}
                        />
                        <Area
                            type="monotone"
                            dataKey="runningBalance"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="url(#balanceGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}