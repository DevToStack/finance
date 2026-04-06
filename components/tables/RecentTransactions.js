"use client";

import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPlus } from 'react-icons/fi';

export default function RecentTransactions() {
    const { transactions } = useFinance();
    const { isDark } = useTheme();

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
        .slice(0, 5);

    // Theme-aware class helper
    const theme = {
        card: isDark ? 'bg-gray-950/50 border border-gray-900' : 'bg-white border-gray-100',
        text: {
            primary: isDark ? 'text-white' : 'text-gray-900',
            secondary: isDark ? 'text-gray-400' : 'text-gray-500',
            tertiary: isDark ? 'text-gray-500' : 'text-gray-400',
        },
        hover: isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50',
        income: {
            bg: isDark ? 'bg-green-900/30' : 'bg-green-100',
            icon: isDark ? 'text-green-400' : 'text-green-600',
            text: isDark ? 'text-green-400' : 'text-green-600',
        },
        expense: {
            bg: isDark ? 'bg-red-900/30' : 'bg-red-100',
            icon: isDark ? 'text-red-400' : 'text-red-600',
            text: isDark ? 'text-red-400' : 'text-red-600',
        },
        emptyState: {
            iconBg: isDark ? 'bg-gray-800' : 'bg-gray-100',
            iconColor: isDark ? 'text-gray-600' : 'text-gray-400',
            text: isDark ? 'text-gray-400' : 'text-gray-500',
            subtext: isDark ? 'text-gray-500' : 'text-gray-400',
            button: isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        }
    };

    if (recentTransactions.length === 0) {
        return (
            <div className={`${theme.card} rounded-xl shadow-sm p-6 transition-colors duration-300`}>
                <h3 className={`text-lg font-semibold mb-4 ${theme.text.primary}`}>Recent Transactions</h3>
                <div className="text-center py-8">
                    <div className={`w-20 h-20 ${theme.emptyState.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300`}>
                        <FiDollarSign className={`w-10 h-10 ${theme.emptyState.iconColor}`} />
                    </div>
                    <p className={theme.emptyState.text}>No transactions yet</p>
                    <p className={`text-sm ${theme.emptyState.subtext} mt-2`}>
                        Add your first transaction to get started
                    </p>
                    <button
                        className={`mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${theme.emptyState.button}`}
                        onClick={() => {
                            // You can add a prop to open add transaction modal
                            console.log('Add transaction clicked');
                        }}
                    >
                        <FiPlus className="w-4 h-4" />
                        Add Transaction
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${theme.card} rounded-xl shadow-sm p-6 transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${theme.text.primary}`}>Recent Transactions</h3>
                {transactions.length > 5 && (
                    <button className={`text-xs ${theme.text.secondary} hover:${theme.text.primary} transition-colors duration-200`}>
                        View All
                    </button>
                )}
            </div>
            <div className="space-y-3">
                {recentTransactions.map(transaction => (
                    <div
                        key={transaction.transaction_id || transaction.id}
                        className={`flex items-center justify-between p-3 ${theme.hover} rounded-lg transition-colors duration-200`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${transaction.type === 'income' ? theme.income.bg : theme.expense.bg} transition-colors duration-200`}>
                                {transaction.type === 'income' ? (
                                    <FiTrendingUp className={`w-4 h-4 ${theme.income.icon}`} />
                                ) : (
                                    <FiTrendingDown className={`w-4 h-4 ${theme.expense.icon}`} />
                                )}
                            </div>
                            <div>
                                <p className={`font-medium ${theme.text.primary}`}>{transaction.description || 'No description'}</p>
                                <p className={`text-xs ${theme.text.secondary}`}>
                                    {transaction.category} • {formatDate(transaction.transaction_date || transaction.date)}
                                </p>
                            </div>
                        </div>
                        <div className={`font-semibold ${transaction.type === 'income' ? theme.income.text : theme.expense.text}`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Optional: Show total summary */}
            {transactions.length > 0 && (
                <div className={`mt-4 pt-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'} text-center`}>
                    <p className={`text-xs ${theme.text.tertiary}`}>
                        Showing {Math.min(transactions.length, 5)} of {transactions.length} transactions
                    </p>
                </div>
            )}
        </div>
    );
}