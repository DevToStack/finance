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
    const { getBalanceTrendData, loading, allTransactions = [] } = useFinance();
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

    // Get the latest transaction data for today
    const getLatestTransactionData = useMemo(() => {
        if (!allTransactions || allTransactions.length === 0) {
            return {
                hour: new Date().getHours(),
                displayHour: new Date().getHours() + 1,
                hasTransactions: false,
                latestTransaction: null,
                transactionCount: 0
            };
        }

        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        // Find all transactions from today
        const todayTransactions = allTransactions.filter(t => {
            if (!t || !t.transaction_date) return false;
            const tDate = new Date(t.transaction_date);
            const tLocalDate = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
            return tLocalDate >= todayStart && tLocalDate <= todayEnd;
        });

        if (todayTransactions.length === 0) {
            return {
                hour: new Date().getHours(),
                displayHour: new Date().getHours() + 1,
                hasTransactions: false,
                latestTransaction: null,
                transactionCount: 0
            };
        }

        // Get the latest transaction
        const latestTransaction = todayTransactions.reduce((latest, current) => {
            const currentDate = new Date(current.transaction_date);
            return currentDate > latest ? currentDate : latest;
        }, new Date(todayTransactions[0].transaction_date));

        const latestHour = latestTransaction.getHours();
        const latestMinute = latestTransaction.getMinutes();

        return {
            hour: latestHour,
            minute: latestMinute,
            displayHour: latestHour + 1,
            hasTransactions: true,
            latestTransaction: latestTransaction,
            transactionCount: todayTransactions.length
        };
    }, [allTransactions]);

    // Get chart data based on selected range
    const getChartData = () => {
        try {
            let start = dateRange.start;
            let end = dateRange.end;
            let interval = 'day';

            // Check if range is today -> use hour interval
            const isTodayRange = start && end &&
                start.toDateString() === end.toDateString() &&
                start.toDateString() === new Date().toDateString();

            if (isTodayRange) {
                interval = 'hour';
            }

            let data = getBalanceTrendData(start, end, interval);

            // Ensure data is an array
            if (!data || !Array.isArray(data)) {
                return [];
            }

            // For today's view, mark which points to show
            if (interval === 'hour' && isTodayRange) {
                const maxDisplayHour = getLatestTransactionData.displayHour;
                data = data.map(item => {
                    let hour = 0;
                    if (item && item.time) {
                        hour = parseInt(item.time.split(':')[0]);
                    }
                    return {
                        ...item,
                        isVisible: hour <= maxDisplayHour,
                        hour: hour
                    };
                });
            }

            return data;
        } catch (error) {
            console.error('Error getting chart data:', error);
            return [];
        }
    };

    const chartData = useMemo(() => getChartData(), [dateRange, getBalanceTrendData, getLatestTransactionData]);

    // Filter data for display (but keep original data for tooltips)
    const visibleChartData = useMemo(() => {
        if (!chartData || !Array.isArray(chartData)) return [];
        if (activeRange !== "today") return chartData;
        return chartData.filter(item => item && item.isVisible !== false);
    }, [chartData, activeRange]);

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
        if (value === undefined || value === null) return '$0';
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const getXAxisTicks = () => {
        if (!visibleChartData || visibleChartData.length === 0) return undefined;

        const dataLength = visibleChartData.length;

        // For today's view with many data points
        if (activeRange === "today") {
            if (dataLength <= 5) return undefined;
            if (dataLength <= 10) {
                return visibleChartData
                    .filter((_, index) => index % 2 === 0)
                    .map(item => item?.displayLabel)
                    .filter(label => label);
            }
            const step = Math.ceil(dataLength / 8);
            return visibleChartData
                .filter((_, index) => index % step === 0)
                .map(item => item?.displayLabel)
                .filter(label => label);
        }

        // For other views, return undefined to let recharts handle it
        return undefined;
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            if (!data) return null;

            const hasTransactions = data.transactions && data.transactions.length > 0;

            return (
                <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-lg shadow-lg border min-w-[200px]`}>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-2`}>
                        {data.time || data.displayDate || data.date || label}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Balance: <span className={`font-semibold ${isDark ? 'text-green-400' : 'text-gray-900'}`}>{formatCurrency(data.balance)}</span>
                    </p>

                    {/* Show transaction details */}
                    {hasTransactions && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold mb-1">Transaction{data.transactions.length > 1 ? 's' : ''}:</p>
                            {data.transactions.map((t, idx) => (
                                <div key={idx} className="text-xs mt-1">
                                    <span className={t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                                        {t.category}
                                    </span>
                                    {t.description && (
                                        <span className="text-gray-400 dark:text-gray-500 ml-2">
                                            {t.description}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Show summary if no individual transactions but totals exist */}
                    {!hasTransactions && (data.income > 0 || data.expense > 0) && (
                        <>
                            {data.income > 0 && (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                    Income: {formatCurrency(data.income)}
                                </p>
                            )}
                            {data.expense > 0 && (
                                <p className="text-sm text-red-500 dark:text-red-400">
                                    Expense: {formatCurrency(data.expense)}
                                </p>
                            )}
                        </>
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
            <div className={`w-full ${loadingBg} rounded-xl shadow-sm border ${cardBg} p-6`}>
                <div className={`h-96 ${loadingContentBg} rounded-xl animate-pulse flex items-center justify-center`}>
                    <div className={loadingText}>Loading chart data...</div>
                </div>
            </div>
        );
    }

    const currentBalance = visibleChartData?.[visibleChartData.length - 1]?.balance || 0;
    const startBalance = visibleChartData?.[0]?.balance || 0;
    const netChange = currentBalance - startBalance;
    const highestBalance = visibleChartData?.length > 0
        ? Math.max(...visibleChartData.map(d => d?.balance || 0), 0)
        : 0;

    const maxDisplayHour = getLatestTransactionData.displayHour;
    const maxTimeStr = getLatestTransactionData.hasTransactions && getLatestTransactionData.latestTransaction
        ? format(getLatestTransactionData.latestTransaction, 'HH:mm')
        : `${maxDisplayHour.toString().padStart(2, '0')}:00`;

    return (
        <div className={`w-full ${cardBg} rounded-xl shadow-sm border p-4 sm:p-6`}>
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
                            className={`px-3 py-1.5 text-sm rounded-lg ${activeRange === range.value ? rangeBtnActive : rangeBtnInactive}`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Range Picker */}
            {showCustomPicker && (
                <div className={`mb-6 p-4 ${customPickerBg} rounded-lg flex flex-col sm:flex-row gap-3 items-end`}>
                    <div className="flex-1">
                        <label className={`block text-xs ${customPickerLabel} mb-1`}>Start Date</label>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${customPickerInput}`}
                        />
                    </div>
                    <div className="flex-1">
                        <label className={`block text-xs ${customPickerLabel} mb-1`}>End Date</label>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${customPickerInput}`}
                        />
                    </div>
                    <button
                        onClick={handleCustomApply}
                        className={`px-4 py-2 ${customPickerApply} text-white rounded-lg`}
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => setShowCustomPicker(false)}
                        className={`px-4 py-2 ${customPickerCancel} rounded-lg`}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className={`${summaryCardBg} rounded-lg p-3`}>
                    <p className={`text-xs ${summaryLabel}`}>Current Balance</p>
                    <p className={`text-xl font-bold ${currentBalance >= 0 ? summaryPositive : summaryNegative}`}>
                        {formatCurrency(currentBalance)}
                    </p>
                </div>
                <div className={`${summaryCardBg} rounded-lg p-3`}>
                    <p className={`text-xs ${summaryLabel}`}>Starting Balance</p>
                    <p className={`text-lg font-semibold ${summaryNeutral}`}>
                        {formatCurrency(startBalance)}
                    </p>
                </div>
                <div className={`${summaryCardBg} rounded-lg p-3`}>
                    <p className={`text-xs ${summaryLabel}`}>Net Change</p>
                    <p className={`text-lg font-semibold ${netChange >= 0 ? summaryPositive : summaryNegative}`}>
                        {netChange >= 0 ? "+" : ""}{formatCurrency(netChange)}
                    </p>
                </div>
                <div className={`${summaryCardBg} rounded-lg p-3`}>
                    <p className={`text-xs ${summaryLabel}`}>Highest Balance</p>
                    <p className={`text-lg font-semibold ${summaryPositive}`}>
                        {formatCurrency(highestBalance)}
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-80 sm:h-96">
                {visibleChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={visibleChartData}
                            margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                            <XAxis
                                dataKey="displayLabel"
                                ticks={getXAxisTicks()}
                                tick={{ fill: chartAxisTick, fontSize: activeRange === "today" ? 10 : 11 }}
                                tickLine={{ stroke: chartAxisLine }}
                                axisLine={{ stroke: chartAxisLine }}
                                angle={activeRange === "today" ? -45 : 0}
                                textAnchor={activeRange === "today" ? "end" : "middle"}
                                height={activeRange === "today" ? 60 : 30}
                                interval={0}
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
            {activeRange === "today" && visibleChartData.length > 0 && (
                <div className={`mt-4 text-xs ${legendText} text-center flex items-center justify-center gap-2`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>
                        Live: Showing data up to {maxTimeStr}
                        {getLatestTransactionData.hasTransactions && getLatestTransactionData.latestTransaction && (
                            <> (Latest transaction at {format(getLatestTransactionData.latestTransaction, 'HH:mm')})</>
                        )}
                    </span>
                </div>
            )}

            {/* Legend / Info */}
            <div className={`mt-4 text-xs ${legendText} text-center`}>
                Balance is calculated as cumulative sum of all transactions (Income - Expenses)
            </div>
        </div>
    );
}