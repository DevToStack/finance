// components/ui/Sparkline.js
"use client";
import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function Sparkline({ data, color = "#3b82f6", trend = "neutral" }) {
    const chartData = useMemo(() => {
        return data.map((value, index) => ({ value, index }));
    }, [data]);

    const strokeColor = trend === "up" ? "#10b981" : trend === "down" ? "#ef4444" : color;

    return (
        <div className="w-24 h-10">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={strokeColor}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
