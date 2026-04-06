"use client";

import { useFinance } from '@/context/FinanceContext';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import BudgetList from '../tables/BudgetList';
import SetBudgetForm from '@/components/forms/SetBudgetForm';
import BudgetProgressChart from '@/components/charts/BudgetProgressChart';
import { formatCurrency } from '@/utils/formatters';
import {
    FiPlus,
    FiTarget,
    FiAlertCircle,
    FiZap,
    FiDollarSign,
    FiTrendingUp,
    FiCalendar,
    FiActivity,
    FiCheckCircle,
    FiTrendingDown
} from 'react-icons/fi';

export default function BudgetTab() {
    const { budgets, getBudgetProgress } = useFinance();
    const [showSetBudget, setShowSetBudget] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const { isDark } = useTheme();

    const overBudgetCategories = budgets.filter(b => {
        const progress = getBudgetProgress(b.category);
        return progress?.isOverBudget;
    });

    // Get recent budgets (last 4 budgets)
    const recentBudgets = budgets.slice(-4).reverse();

    // Dynamic classes based on theme
    const headerTitle = isDark ? 'text-white' : 'text-gray-800';
    const headerSubtitle = isDark ? 'text-gray-400' : 'text-gray-500';
    const createBtn = isDark ? 'bg-purple-700 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700';

    const alertBg = isDark ? 'bg-red-950/30 border-red-800' : 'bg-red-50 border-red-200';
    const alertTitle = isDark ? 'text-red-200' : 'text-red-800';
    const alertText = isDark ? 'text-red-300' : 'text-red-600';
    const alertIcon = isDark ? 'text-red-400' : 'text-red-500';

    const rightColumnBg = isDark ? 'bg-gray-950/50 border-gray-700' : 'bg-white border-gray-100';
    const rightColumnHeaderBg = isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100';
    const rightColumnHeaderIcon = isDark ? 'bg-gray-700' : 'bg-purple-50';
    const rightColumnHeaderIconColor = isDark ? 'text-purple-400' : 'text-purple-600';
    const rightColumnTitle = isDark ? 'text-white' : 'text-gray-800';
    const rightColumnBadge = isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500';

    const categoryText = isDark ? 'text-white' : 'text-gray-800';
    const metaText = isDark ? 'text-gray-500' : 'text-gray-400';
    const amountText = isDark ? 'text-white' : 'text-gray-800';
    const progressBarBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
    const spendingText = isDark ? 'text-gray-300' : 'text-gray-600';
    const spendingAmount = isDark ? 'text-white' : 'text-gray-800';
    const dividerBg = isDark ? 'via-gray-700' : 'via-gray-200';
    const borderLine = isDark ? 'border-gray-700' : 'border-gray-50';

    const emptyStateBg = isDark ? 'bg-gray-800/50' : 'bg-gradient-to-br from-gray-50 to-gray-100';
    const emptyStateBorder = isDark ? 'border-gray-700' : 'border-gray-200';
    const emptyStateIcon = isDark ? 'text-gray-600' : 'text-gray-300';
    const emptyStateTitle = isDark ? 'text-gray-300' : 'text-gray-700';
    const emptyStateText = isDark ? 'text-gray-500' : 'text-gray-400';
    const emptyStateBtn = isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white';

    const viewAllBg = isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-100';
    const viewAllText = isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900';

    const sectionTitle = isDark ? 'text-white' : 'text-gray-800';
    const sectionCount = isDark ? 'text-gray-500' : 'text-gray-500';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={`text-2xl font-bold ${headerTitle}`}>Budget Planning</h2>
                    <p className={`${headerSubtitle} mt-1`}>Set and track your monthly budgets</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedBudget(null);
                        setShowSetBudget(true);
                    }}
                    className={`px-4 py-2 ${createBtn} text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm`}
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Set Budget</span>
                </button>
            </div>

            {/* Budget Alerts */}
            {overBudgetCategories.length > 0 && (
                <div className={`${alertBg} border rounded-lg p-4 animate-fadeIn transition-all duration-300`}>
                    <div className="flex items-start gap-3">
                        <FiAlertCircle className={`w-5 h-5 ${alertIcon} mt-0.5 flex-shrink-0`} />
                        <div>
                            <h3 className={`font-semibold ${alertTitle}`}>Budget Alert</h3>
                            <p className={`text-sm ${alertText} mt-1`}>
                                You've exceeded your budget in {overBudgetCategories.length} {overBudgetCategories.length === 1 ? 'category' : 'categories'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Two Column Layout: Chart (Left) + Recent Budgets (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetProgressChart />

                {/* Right Column - Recent Budgets */}
                <div className={`${rightColumnBg} rounded-xl border shadow-sm overflow-hidden transition-all duration-300`}>
                    <div className={`p-4 border-b ${rightColumnHeaderBg}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 ${rightColumnHeaderIcon} rounded-lg`}>
                                    <FiTarget className={`w-4 h-4 ${rightColumnHeaderIconColor}`} />
                                </div>
                                <h3 className={`font-semibold ${rightColumnTitle}`}>Recent Budgets</h3>
                            </div>
                            {recentBudgets.length > 0 && (
                                <span className={`text-xs ${rightColumnBadge} px-2 py-0.5 rounded-full`}>
                                    {recentBudgets.length} active
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-4">
                        {recentBudgets.length > 0 ? (
                            <div className="space-y-4">
                                {recentBudgets.slice(0, 5).map((budget, index) => {
                                    const progress = getBudgetProgress(budget.category);
                                    const percentage = Math.min(progress?.percentage || 0, 100);
                                    const isOverBudget = progress?.isOverBudget || percentage >= 100;

                                    // Dynamic colors based on percentage
                                    const getBarColor = () => {
                                        if (isOverBudget) return 'bg-red-500';
                                        if (percentage >= 80) return 'bg-amber-500';
                                        if (percentage >= 50) return 'bg-blue-500';
                                        if (percentage >= 25) return 'bg-teal-500';
                                        return 'bg-emerald-500';
                                    };

                                    const getStatusIcon = () => {
                                        if (isOverBudget) return <FiAlertCircle className="w-3 h-3 text-red-500" />;
                                        if (percentage >= 80) return <FiActivity className="w-3 h-3 text-amber-500" />;
                                        if (percentage >= 50) return <FiTrendingUp className="w-3 h-3 text-blue-500" />;
                                        return <FiCheckCircle className="w-3 h-3 text-emerald-500" />;
                                    };

                                    return (
                                        <div
                                            key={budget.budget_id || budget.id || budget.category}
                                            className="group relative"
                                        >
                                            {/* Category Header */}
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`font-medium ${categoryText} text-sm`}>
                                                            {budget.category}
                                                        </span>
                                                        <span className="inline-flex items-center gap-0.5">
                                                            {getStatusIcon()}
                                                        </span>
                                                    </div>
                                                    <div className={`flex items-center gap-2 text-xs ${metaText}`}>
                                                        <span className="flex items-center gap-0.5">
                                                            <FiCalendar className="w-3 h-3" />
                                                            {new Date().toLocaleString('default', { month: 'short' })}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-0.5">
                                                            <FiDollarSign className="w-3 h-3" />
                                                            Monthly
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-sm font-semibold ${amountText}`}>
                                                        {formatCurrency(budget.amount)}
                                                    </div>
                                                    <div className={`text-xs ${metaText}`}>
                                                        budget
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="relative mb-2">
                                                <div className={`w-full ${progressBarBg} rounded-full h-1.5 overflow-hidden`}>
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Spending Info */}
                                            <div className="flex justify-between items-center text-xs">
                                                <div className="flex items-center gap-1">
                                                    <FiTrendingUp className={`w-3 h-3 ${metaText}`} />
                                                    <span className={spendingText}>
                                                        Spent: <span className={`font-medium ${spendingAmount}`}>{formatCurrency(progress?.spent || 0)}</span>
                                                    </span>
                                                </div>
                                                <div className={`font-medium ${isOverBudget ? 'text-red-600 dark:text-red-400' :
                                                        percentage >= 80 ? 'text-amber-600 dark:text-amber-400' :
                                                            spendingText
                                                    }`}>
                                                    {Math.round(percentage)}% used
                                                </div>
                                            </div>

                                            {/* Remaining/Over Budget Indicator */}
                                            {progress && (
                                                <div className={`mt-2 pt-2 ${borderLine} border-t`}>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className={metaText}>
                                                            {isOverBudget ? (
                                                                <span className="flex items-center gap-1">
                                                                    <FiTrendingDown className="w-3 h-3 text-red-500" />
                                                                    Over by {formatCurrency(Math.abs(progress.remaining))}
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1">
                                                                    <FiCheckCircle className="w-3 h-3 text-emerald-500" />
                                                                    {formatCurrency(progress.remaining)} remaining
                                                                </span>
                                                            )}
                                                        </span>
                                                        {percentage >= 80 && !isOverBudget && (
                                                            <span className="text-amber-600 dark:text-amber-400 text-xs flex items-center gap-0.5">
                                                                <FiAlertCircle className="w-3 h-3" />
                                                                Near limit
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Animated divider between items */}
                                            {index < recentBudgets.length - 1 && (
                                                <div className={`absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent ${dividerBg} to-transparent`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Enhanced Empty State */
                            <div className="text-center py-8">
                                <div className="relative inline-block mb-4">
                                    <div className={`w-16 h-16 ${emptyStateBg} rounded-full flex items-center justify-center mx-auto border ${emptyStateBorder}`}>
                                        <FiTarget className={`w-8 h-8 ${emptyStateIcon}`} />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center animate-pulse">
                                        <FiZap className="w-3 h-3 text-purple-500 dark:text-purple-400" />
                                    </div>
                                </div>
                                <h4 className={`text-sm font-medium ${emptyStateTitle} mb-1`}>No budgets yet</h4>
                                <p className={`text-xs ${emptyStateText} mb-4`}>Create your first budget to start tracking</p>
                                <button
                                    onClick={() => {
                                        setSelectedBudget(null);
                                        setShowSetBudget(true);
                                    }}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${emptyStateBtn} text-xs rounded-lg transition-colors`}
                                >
                                    <FiDollarSign className="w-3.5 h-3.5" />
                                    Create budget
                                </button>
                            </div>
                        )}
                    </div>

                    {/* View All Link - Only show if more than 4 budgets */}
                    {recentBudgets.length > 0 && budgets.length > 4 && (
                        <div className={`px-4 py-3 ${viewAllBg} border-t ${rightColumnHeaderBg}`}>
                            <button
                                onClick={() => {
                                    document.getElementById('all-budgets-section')?.scrollIntoView({
                                        behavior: 'smooth'
                                    });
                                }}
                                className={`w-full text-center text-xs ${viewAllText} font-medium flex items-center justify-center gap-1 transition-colors`}
                            >
                                View all {budgets.length} budgets
                                <FiTrendingUp className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* All Budgets List - Full Width at Bottom */}
            <div id="all-budgets-section" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-semibold ${sectionTitle}`}>All Budgets</h3>
                    {budgets.length > 0 && (
                        <span className={`text-sm ${sectionCount}`}>{budgets.length} total</span>
                    )}
                </div>
                <BudgetList />
            </div>

            {/* Set Budget Modal */}
            {showSetBudget && (
                <SetBudgetForm
                    onClose={() => {
                        setShowSetBudget(false);
                        setSelectedBudget(null);
                    }}
                    editBudget={selectedBudget}
                />
            )}

            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}