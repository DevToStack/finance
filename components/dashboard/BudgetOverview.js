// components/BudgetOverview.js
"use client";

import { Fragment, useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency } from '@/utils/formatters';
import { FiAlertCircle, FiChevronRight, FiPlus, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

export default function BudgetOverview() {
    const { budgets, getBudgetProgress } = useFinance();
    const { isDark } = useTheme();
    const [expandedCategory, setExpandedCategory] = useState(null);

    const activeBudgets = budgets.slice(0, 4);
    const alertBudgets = activeBudgets.filter(b => {
        const progress = getBudgetProgress(b.category);
        return progress?.percentage >= 80;
    });

    const getStatusColor = (percentage) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 80) return 'bg-yellow-500';
        if (percentage >= 60) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getStatusText = (percentage) => {
        if (percentage >= 100) return 'Over Budget';
        if (percentage >= 80) return 'Near Limit';
        if (percentage >= 60) return 'Moderate Usage';
        return 'Good Progress';
    };

    // Theme-based classes
    const cardBg = isDark ? 'bg-gray-950/50' : 'bg-gradient-to-br from-white to-gray-50';
    const borderColor = isDark ? 'border-gray-900' : 'border-gray-100';
    const textPrimary = isDark ? 'text-white' : 'text-gray-800';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const textTertiary = isDark ? 'text-gray-500' : 'text-gray-400';
    const headingGradient = isDark ? 'text-white' : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent';
    const alertBg = isDark ? 'bg-yellow-900/30' : 'bg-yellow-50';
    const alertBorder = isDark ? 'border-yellow-800' : 'border-yellow-200';
    const alertText = isDark ? 'text-yellow-400' : 'text-yellow-700';
    const categoryBg = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const categoryBorder = isDark ? 'border-gray-800' : 'border-gray-100';
    const progressBarBg = isDark ? 'bg-gray-800' : 'bg-gray-200';
    const warningBg = isDark ? 'bg-yellow-900/20' : 'bg-yellow-50';
    const warningBorder = isDark ? 'border-yellow-800' : 'border-yellow-200';
    const warningText = isDark ? 'text-yellow-300' : 'text-yellow-800';
    const footerBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const buttonGradient = isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100';
    const buttonText = isDark ? 'text-gray-300' : 'text-purple-700';
    const addButtonText = isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-500 hover:text-purple-600';
    const iconWrapperBg = isDark ? 'bg-gray-800' : 'bg-gradient-to-br from-purple-100 to-blue-100';
    const iconColor = isDark ? 'text-purple-400' : 'text-purple-600';

    if (activeBudgets.length === 0) {
        return (
            <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-xl font-bold ${headingGradient}`}>
                        Budget Overview
                    </h3>
                </div>
                <div className="text-center py-12">
                    <div className={`w-20 h-20 ${iconWrapperBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <FiDollarSign className={`w-10 h-10 ${iconColor}`} />
                    </div>
                    <p className={`${textSecondary} mb-3`}>No budgets set yet</p>
                    <p className={`text-sm ${textTertiary} mb-6`}>Create your first budget to track spending</p>
                    <button className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all`}>
                        <FiPlus className="w-4 h-4" />
                        Set your first budget
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6`}>
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className={`text-xl font-bold ${headingGradient}`}>
                        Budget Overview
                    </h3>
                    <p className={`text-sm ${textSecondary} mt-1`}>Track your monthly spending limits</p>
                </div>
                {alertBudgets.length > 0 && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 ${alertBg} rounded-full border ${alertBorder}`}>
                        <FiAlertCircle className={`w-4 h-4 ${alertText} animate-pulse`} />
                        <span className={`text-xs font-medium ${alertText}`}>
                            {alertBudgets.length} {alertBudgets.length === 1 ? 'alert' : 'alerts'}
                        </span>
                    </div>
                )}
            </div>

            {/* Budget List */}
            <div className="space-y-5">
                {activeBudgets.map((budget, index) => {
                    const progress = getBudgetProgress(budget.category);
                    if (!progress) return null;

                    const percentage = Math.min(progress.percentage, 100);
                    const remaining = progress.amount - progress.spent;
                    const isOverBudget = percentage >= 100;
                    const statusColor = getStatusColor(percentage);
                    const statusText = getStatusText(percentage);
                    const isExpanded = expandedCategory === budget.category;

                    const getStatusBadgeClass = () => {
                        if (isOverBudget) return isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700';
                        if (percentage >= 80) return isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
                        if (percentage >= 60) return isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700';
                        return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700';
                    };

                    return (
                        <Fragment key={budget.budget_id || budget.id}>
                            <div
                                className="group cursor-pointer transition-colors duration-200"
                                onClick={() => setExpandedCategory(isExpanded ? null : budget.category)}
                            >
                                {/* Category Header */}
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                                        <span className={`font-semibold ${textPrimary}`}>{budget.category}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass()}`}>
                                            {statusText}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-semibold ${textPrimary}`}>
                                            {formatCurrency(progress.spent)}
                                        </span>
                                        <span className={`text-xs ${textTertiary}`}> / </span>
                                        <span className={`text-sm ${textSecondary}`}>
                                            {formatCurrency(progress.amount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative mb-2">
                                    <div className={`overflow-hidden h-3 text-xs flex rounded-full ${progressBarBg} shadow-inner`}>
                                        <div
                                            style={{ width: `${percentage}%` }}
                                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ease-out ${statusColor}`}
                                        >
                                            {percentage > 15 && (
                                                <span className="text-xs font-medium">{Math.round(percentage)}%</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center gap-1 ${textSecondary}`}>
                                            <FiTrendingUp className="w-3 h-3" />
                                            <span>{Math.round(percentage)}% used</span>
                                        </div>
                                        {remaining > 0 && !isOverBudget && (
                                            <div className="text-green-600 dark:text-green-400 font-medium">
                                                {formatCurrency(remaining)} left
                                            </div>
                                        )}
                                        {isOverBudget && (
                                            <div className="text-red-600 dark:text-red-400 font-medium">
                                                {formatCurrency(Math.abs(remaining))} over
                                            </div>
                                        )}
                                    </div>
                                    <FiChevronRight className={`w-4 h-4 ${textTertiary} transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''
                                        }`} />
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className={`mt-4 pt-4 border-t ${categoryBorder}`}>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className={`${categoryBg} rounded-lg p-2 text-center`}>
                                                <p className={`text-xs ${textSecondary} mb-1`}>Monthly Limit</p>
                                                <p className={`text-sm font-semibold ${textPrimary}`}>
                                                    {formatCurrency(progress.amount)}
                                                </p>
                                            </div>
                                            <div className={`${categoryBg} rounded-lg p-2 text-center`}>
                                                <p className={`text-xs ${textSecondary} mb-1`}>Daily Average</p>
                                                <p className={`text-sm font-semibold ${textPrimary}`}>
                                                    {formatCurrency(progress.spent / 30)}
                                                </p>
                                            </div>
                                        </div>
                                        {percentage >= 80 && (
                                            <div className={`mt-3 p-2 ${warningBg} rounded-lg border ${warningBorder}`}>
                                                <p className={`text-xs ${warningText}`}>
                                                    ⚠️ You're approaching your budget limit. Consider reducing expenses in this category.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {index < activeBudgets.length - 1 && (
                                <div className={`border-t ${categoryBorder} my-3`} />
                            )}
                        </Fragment>
                    );
                })}
            </div>

            {/* Footer Actions */}
            <div className={`mt-6 pt-4 border-t ${footerBorder}`}>
                {budgets.length > 4 && (
                    <button className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 ${buttonGradient} ${buttonText} rounded-xl transition-all group`}>
                        <span className="text-sm font-medium">
                            View all {budgets.length} budgets
                        </span>
                        <FiChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                )}

                <button className={`w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 ${addButtonText} transition-colors text-sm`}>
                    <FiPlus className="w-4 h-4" />
                    Add new budget
                </button>
            </div>
        </div>
    );
}