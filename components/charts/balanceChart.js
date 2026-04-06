"use client";

import { useFinance } from "@/context/FinanceContext";
import { useState, useMemo } from "react";
import { useTheme } from "@/hooks/useTheme";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Area,
} from "recharts";
import { format, subDays, startOfToday, endOfToday } from "date-fns";
import { FiBarChart2 } from "react-icons/fi";

export default function BalanceTrendChart() {
    const { getBalanceTrendData, loading } = useFinance();
    const { isDark } = useTheme();

    // State for date range
    const [dateRange, setDateRange] = useState({
        start: subDays(new Date(), 7),
        end: new Date(),
    });
    const [activeRange, setActiveRange] = useState("7d");

    // State for custom range picker
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    // Get chart data based on selected range
    const getChartData = () => {
        let start = dateRange.start;
        let end = dateRange.end;
        let interval = 'day';

        // Check if range is today -> use hour interval
        const isTodayRange =
            start.toDateString() === end.toDateString() &&
            start.toDateString() === new Date().toDateString();

        if (isTodayRange) {
            interval = 'hour';
        }

        let data = getBalanceTrendData(start, end, interval);

        // For today's view, only show hours from 00:00 to current hour
        if (interval === 'hour' && isTodayRange) {
            const currentHour = new Date().getHours();
            data = data.filter(item => {
                if (item.time) {
                    const hour = parseInt(item.time.split(':')[0]);
                    return hour <= currentHour;
                }
                return true;
            });
        }

        return data;
    };

    const chartData = useMemo(() => getChartData(), [dateRange, getBalanceTrendData]);

    // Predefined ranges
    const ranges = [
        { label: "Today", value: "today", getRange: () => ({ start: startOfToday(), end: endOfToday() }) },
        { label: "Last 7 Days", value: "7d", getRange: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
        { label: "Last 30 Days", value: "30d", getRange: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
        { label: "This Month", value: "month", getRange: () => ({ start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date() }) },
        { label: "Custom", value: "custom", getRange: null },
    ];

    const handleRangeChange = (range) => {
        setActiveRange(range.value);

        if (range.value === "custom") {
            setShowCustomPicker(true);
            return;
        }

        const { start, end } = range.getRange();
        setDateRange({ start, end });
        setShowCustomPicker(false);
    };

    const handleCustomApply = () => {
        if (customStart && customEnd) {
            setDateRange({
                start: new Date(customStart),
                end: new Date(customEnd),
            });
            setShowCustomPicker(false);
            setActiveRange("custom");
        }
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    };

    // Custom XAxis ticks for today's view - only show specific hours
    const getXAxisTicks = () => {
        if (activeRange !== "today") return undefined;

        const currentHour = new Date().getHours();
        const ticks = [];

        // Always show 00:00
        ticks.push("00:00");

        // Show every 3 hours or based on data points
        for (let hour = 3; hour <= currentHour; hour += 3) {
            ticks.push(`${hour.toString().padStart(2, '0')}:00`);
        }

        // Always show current hour if it's not already included
        const currentHourStr = `${currentHour.toString().padStart(2, '0')}:00`;
        if (!ticks.includes(currentHourStr) && currentHour > 0) {
            ticks.push(currentHourStr);
        }

        return ticks;
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-lg border min-w-[200px] `}>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
                        {data.time || data.displayDate || data.date}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Balance: <span className={`font-semibold ${isDark ? 'text-green-400' : 'text-gray-900'}`}>{formatCurrency(data.balance)}</span>
                    </p>
                    {data.income !== undefined && data.income > 0 && (
                        <>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                Income: {formatCurrency(data.income)}
                            </p>
                            <p className="text-sm text-red-500 dark:text-red-400">
                                Expense: {formatCurrency(data.expense)}
                            </p>
                        </>
                    )}
                    {data.transactions?.length > 0 && (
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                            {data.transactions.length} transaction{data.transactions.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    // Dynamic classes based on theme
    const cardBg = isDark ? 'bg-gray-950/50 border-gray-900' : 'bg-white border-gray-100';
    const titleText = isDark ? 'text-white' : 'text-gray-800';
    const subtitleText = isDark ? 'text-gray-400' : 'text-gray-500';
    const rangeBtnActive = isDark ? 'bg-green-700 text-white' : 'bg-green-600 text-white';
    const rangeBtnInactive = isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

    const customPickerBg = isDark ? 'bg-gray-700/50' : 'bg-gray-50';
    const customPickerLabel = isDark ? 'text-gray-400' : 'text-gray-500';
    const customPickerInput = isDark ? 'bg-gray-800 border-gray-600 text-white focus:ring-green-600' : 'bg-white border-gray-300 focus:ring-green-500';
    const customPickerApply = isDark ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700';
    const customPickerCancel = isDark ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

    const summaryCardBg = isDark ? 'bg-black' : 'bg-gray-50';
    const summaryLabel = isDark ? 'text-gray-400' : 'text-gray-500';
    const summaryPositive = isDark ? 'text-green-400' : 'text-green-600';
    const summaryNegative = isDark ? 'text-red-400' : 'text-red-500';
    const summaryNeutral = isDark ? 'text-white' : 'text-gray-800';

    const chartGrid = isDark ? '#374151' : '#e5e7eb';
    const chartAxisTick = isDark ? '#9CA3AF' : '#6b7280';
    const chartAxisLine = isDark ? '#374151' : '#e5e7eb';
    const chartReferenceLine = isDark ? '#f87171' : '#ef4444';
    const chartAreaFill = isDark ? '#34D399' : '#10b981';
    const chartLineStroke = isDark ? '#34D399' : '#10b981';
    const chartDotFill = isDark ? '#34D399' : '#10b981';

    const emptyStateText = isDark ? 'text-gray-400' : 'text-gray-500';
    const emptyStateSubtext = isDark ? 'text-gray-500' : 'text-gray-400';
    const emptyStateIconBg = isDark ? 'bg-gray-800' : 'bg-gray-100';
    const emptyStateIconColor = isDark ? 'text-gray-600' : 'text-gray-400';
    const legendText = isDark ? 'text-gray-400' : 'text-gray-400';
    const loadingBg = isDark ? 'bg-gray-800' : 'bg-white';
    const loadingContentBg = isDark ? 'bg-gray-700/50' : 'bg-gray-50';
    const loadingText = isDark ? 'text-gray-400' : 'text-gray-400';

    if (loading) {
        return (
            <div className={`w-full ${loadingBg} rounded-xl shadow-sm border ${cardBg} p-6 `}>
                <div className={`h-96 ${loadingContentBg} rounded-xl animate-pulse flex items-center justify-center`}>
                    <div className={loadingText}>Loading chart data...</div>
                </div>
            </div>
        );
    }

    const currentBalance = chartData[chartData.length - 1]?.balance || 0;
    const startBalance = chartData[0]?.balance || 0;
    const netChange = currentBalance - startBalance;
    const currentHour = new Date().getHours();
    const currentHourStr = `${currentHour.toString().padStart(2, '0')}:00`;

    return (
        <div className={`w-full ${cardBg} rounded-xl shadow-sm border p-4 sm:p-6 `}>
            {/* Header with Range Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className={`text-lg sm:text-xl font-semibold ${titleText}`}>
                        Balance Trend
                    </h2>
                    <p className={`text-sm ${subtitleText} mt-1`}>
                        {format(dateRange.start, "MMM dd, yyyy")} - {format(dateRange.end, "MMM dd, yyyy")}
                    </p>
                </div>

                {/* Range Buttons */}
                <div className="flex flex-wrap gap-2">
                    {ranges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => handleRangeChange(range)}
                            className={`px-3 py-1.5 text-sm rounded-lg  ${activeRange === range.value ? rangeBtnActive : rangeBtnInactive
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Range Picker */}
            {showCustomPicker && (
                <div className={`mb-6 p-4 ${customPickerBg} rounded-lg flex flex-col sm:flex-row gap-3 items-end `}>
                    <div className="flex-1">
                        <label className={`block text-xs ${customPickerLabel} mb-1`}>Start Date</label>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2  ${customPickerInput}`}
                        />
                    </div>
                    <div className="flex-1">
                        <label className={`block text-xs ${customPickerLabel} mb-1`}>End Date</label>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2  ${customPickerInput}`}
                        />
                    </div>
                    <button
                        onClick={handleCustomApply}
                        className={`px-4 py-2 ${customPickerApply} text-white rounded-lg `}
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => setShowCustomPicker(false)}
                        className={`px-4 py-2 ${customPickerCancel} rounded-lg `}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className={`${summaryCardBg} rounded-lg p-3 `}>
                    <p className={`text-xs ${summaryLabel}`}>Current Balance</p>
                    <p className={`text-xl font-bold ${currentBalance >= 0 ? summaryPositive : summaryNegative}`}>
                        {formatCurrency(currentBalance)}
                    </p>
                </div>
                <div className={`${summaryCardBg} rounded-lg p-3 `}>
                    <p className={`text-xs ${summaryLabel}`}>Starting Balance</p>
                    <p className={`text-lg font-semibold ${summaryNeutral}`}>
                        {formatCurrency(startBalance)}
                    </p>
                </div>
                <div className={`${summaryCardBg} rounded-lg p-3 `}>
                    <p className={`text-xs ${summaryLabel}`}>Net Change</p>
                    <p className={`text-lg font-semibold ${netChange >= 0 ? summaryPositive : summaryNegative}`}>
                        {netChange >= 0 ? "+" : ""}{formatCurrency(netChange)}
                    </p>
                </div>
                <div className={`${summaryCardBg} rounded-lg p-3 `}>
                    <p className={`text-xs ${summaryLabel}`}>Highest Balance</p>
                    <p className={`text-lg font-semibold ${summaryPositive}`}>
                        {formatCurrency(Math.max(...chartData.map(d => d.balance), 0))}
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-80 sm:h-96">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                            <XAxis
                                dataKey={(item) => {
                                    if (item.time) return item.time;
                                    if (item.displayDate) return item.displayDate;
                                    if (item.date) return item.date;
                                    return "";
                                }}
                                ticks={getXAxisTicks()}
                                tick={{ fill: chartAxisTick, fontSize: 11 }}
                                tickLine={{ stroke: chartAxisLine }}
                                axisLine={{ stroke: chartAxisLine }}
                                domain={activeRange === "today" ? ['00:00', currentHourStr] : undefined}
                            />
                            <YAxis
                                tickFormatter={formatCurrency}
                                tick={{ fill: chartAxisTick, fontSize: 11 }}
                                tickLine={{ stroke: chartAxisLine }}
                                axisLine={{ stroke: chartAxisLine }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: legendText }} />

                            {/* Zero balance reference line */}
                            <ReferenceLine y={0} stroke={chartReferenceLine} strokeDasharray="3 3" label="Zero" />

                            {/* Area under line */}
                            <Area
                                type="monotone"
                                dataKey="balance"
                                fill={chartAreaFill}
                                fillOpacity={0.1}
                                stroke="none"
                            />

                            {/* Main balance line */}
                            <Line
                                type="monotone"
                                dataKey="balance"
                                name="Balance"
                                stroke={chartLineStroke}
                                strokeWidth={3}
                                dot={{
                                    r: 3,
                                    strokeWidth: 2,
                                    stroke: isDark ? "#1F2937" : "#ffffff",
                                    fill: chartDotFill,
                                }}
                                activeDot={{ r: 6, strokeWidth: 2, stroke: isDark ? "#1F2937" : "#ffffff" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className={`w-20 h-20 ${emptyStateIconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <FiBarChart2 className={`w-10 h-10 ${emptyStateIconColor}`} />
                            </div>
                            <p className={emptyStateText}>No transactions in this period</p>
                            <p className={`text-sm ${emptyStateSubtext} mt-2`}>
                                Try selecting a different date range or add some transactions
                            </p>
                            <div className="flex gap-2 justify-center mt-4">
                                <button
                                    onClick={() => handleRangeChange(ranges[1])}
                                    className={`px-3 py-1.5 text-xs rounded-lg ${rangeBtnInactive}`}
                                >
                                    Last 7 Days
                                </button>
                                <button
                                    onClick={() => handleRangeChange(ranges[2])}
                                    className={`px-3 py-1.5 text-xs rounded-lg ${rangeBtnInactive}`}
                                >
                                    Last 30 Days
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Live Clock Indicator for Today's View */}
            {activeRange === "today" && chartData.length > 0 && (
                <div className={`mt-4 text-xs ${legendText} text-center flex items-center justify-center gap-2`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live: Showing data from 00:00 to {currentHourStr} ({currentHour}:00)</span>
                </div>
            )}

            {/* Legend / Info */}
            <div className={`mt-4 text-xs ${legendText} text-center`}>
                Balance is calculated as cumulative sum of all transactions (Income - Expenses)
            </div>
        </div>
    );
}