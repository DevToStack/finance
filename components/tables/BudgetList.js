// components/BudgetList.js
"use client";

import { useFinance } from '@/context/FinanceContext';
import { useState } from 'react';
import { formatCurrency } from '@/utils/formatters';
import { useTheme } from '@/hooks/useTheme';
import {
    FiEdit2,
    FiTrash2,
    FiAlertCircle,
    FiCheckCircle,
    FiTrendingUp,
    FiTrendingDown,
    FiDollarSign,
    FiClock,
    FiTarget,
    FiPieChart,
    FiCalendar,
    FiZap,
    FiShield,
    FiActivity
} from 'react-icons/fi';
import SetBudgetForm from '@/components/forms/SetBudgetForm';

export default function BudgetList() {
    const { budgets, deleteBudget, getBudgetProgress } = useFinance();
    const [editingBudget, setEditingBudget] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { isDark } = useTheme();

    const getRingColor = (percentage, isOverBudget) => {
        if (isOverBudget || percentage >= 100) return '#ef4444';
        if (percentage >= 80) return '#f59e0b';
        if (percentage >= 50) return '#3b82f6';
        if (percentage >= 25) return '#14b8a6';
        return '#10b981';
    };

    const getStatusColor = (percentage, isOverBudget) => {
        if (isOverBudget || percentage >= 100) return isDark ? 'text-red-400' : 'text-red-600';
        if (percentage >= 80) return isDark ? 'text-amber-400' : 'text-amber-600';
        if (percentage >= 50) return isDark ? 'text-blue-400' : 'text-blue-600';
        return isDark ? 'text-emerald-400' : 'text-emerald-600';
    };

    const getStatusText = (percentage, isOverBudget) => {
        if (isOverBudget || percentage >= 100) return 'Over Budget';
        if (percentage >= 80) return 'Near Limit';
        if (percentage >= 50) return 'On Track';
        return 'Good Progress';
    };

    const CircularProgress = ({ percentage, size = 80, strokeWidth = 6, color }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;
        const trackColor = isDark ? '#374151' : '#f3f4f6';

        return (
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                />
            </svg>
        );
    };

    const calculateProjection = (spent, amount) => {
        const daysPassed = new Date().getDate();
        const daysInMonth = 30;
        const dailyAvg = spent / daysPassed;
        const projected = dailyAvg * daysInMonth;
        const variance = projected - amount;
        return {
            projected,
            variance,
            isOverProjection: variance > 0,
            dailyAvg
        };
    };

    // Dynamic classes based on theme
    const emptyStateBg = isDark ? 'bg-gray-800/50' : 'bg-gray-50';
    const emptyStateBorder = isDark ? 'border-gray-700' : 'border-gray-100';
    const emptyStateIcon = isDark ? 'text-gray-600' : 'text-gray-300';
    const emptyStateTitle = isDark ? 'text-white' : 'text-gray-900';
    const emptyStateText = isDark ? 'text-gray-400' : 'text-gray-500';
    const emptyStateBtn = isDark ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white';

    const statCardBg = isDark ? 'bg-gray-950/50 border-gray-700' : 'bg-white border-gray-200';
    const statLabel = isDark ? 'text-gray-500' : 'text-gray-400';
    const statValue = isDark ? 'text-white' : 'text-gray-900';
    const statSubtext = isDark ? 'text-gray-400' : 'text-gray-500';

    const budgetCardBg = isDark ? 'bg-gray-950/50 border-gray-700' : 'bg-white border-gray-200';
    const categoryText = isDark ? 'text-white' : 'text-gray-900';
    const metaText = isDark ? 'text-gray-500' : 'text-gray-400';
    const amountText = isDark ? 'text-white' : 'text-gray-900';
    const budgetAmountText = isDark ? 'text-gray-300' : 'text-gray-700';
    const statDetailBg = isDark ? 'bg-gray-700/50' : 'bg-gray-50';
    const statDetailText = isDark ? 'text-white' : 'text-gray-900';
    const progressBarBg = isDark ? 'bg-gray-700' : 'bg-gray-100';
    const insightBorder = isDark ? 'border-gray-700' : 'border-gray-100';
    const insightText = isDark ? 'text-gray-400' : 'text-gray-500';

    const modalOverlay = isDark ? 'bg-black/70' : 'bg-black/40';
    const modalBg = isDark ? 'bg-gray-800' : 'bg-white';
    const modalTitle = isDark ? 'text-white' : 'text-gray-900';
    const modalText = isDark ? 'text-gray-400' : 'text-gray-500';
    const modalCategory = isDark ? 'text-gray-200' : 'text-gray-700';
    const cancelBtn = isDark ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700';

    const editButton = isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-100';
    const deleteButton = isDark ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-100';
    const deleteButtonHover = isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600';

    if (budgets.length === 0) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="relative inline-block mb-6">
                        <div className={`w-32 h-32 ${emptyStateBg} rounded-2xl flex items-center justify-center mx-auto border ${emptyStateBorder}`}>
                            <FiDollarSign className={`w-16 h-16 ${emptyStateIcon}`} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                            <FiZap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        </div>
                    </div>
                    <h3 className={`text-2xl font-bold ${emptyStateTitle} mb-2`}>No budgets yet</h3>
                    <p className={`${emptyStateText} mb-8`}>Create your first budget to start tracking your spending</p>
                    <button className={`inline-flex items-center gap-2 px-6 py-3 ${emptyStateBtn} rounded-xl`}>
                        <FiDollarSign className="w-5 h-5" />
                        Create budget
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`${statCardBg} rounded-xl border p-5 transition-colors duration-300`}>
                    <div className="flex items-center justify-between mb-3">
                        <FiTarget className={`w-5 h-5 ${statLabel}`} />
                        <span className={`text-xs ${statLabel}`}>Total</span>
                    </div>
                    <div className={`text-3xl font-bold ${statValue}`}>{budgets.length}</div>
                    <div className={`text-sm ${statSubtext} mt-1`}>Active budgets</div>
                </div>

                <div className={`${statCardBg} rounded-xl border p-5 transition-colors duration-300`}>
                    <div className="flex items-center justify-between mb-3">
                        <FiCheckCircle className={`w-5 h-5 ${statLabel}`} />
                        <span className={`text-xs ${statLabel}`}>Healthy</span>
                    </div>
                    <div className={`text-3xl font-bold ${statValue}`}>
                        {budgets.filter(b => {
                            const progress = getBudgetProgress(b.category);
                            return progress?.percentage < 70;
                        }).length}
                    </div>
                    <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">On track</div>
                </div>

                <div className={`${statCardBg} rounded-xl border p-5 transition-colors duration-300`}>
                    <div className="flex items-center justify-between mb-3">
                        <FiActivity className={`w-5 h-5 ${statLabel}`} />
                        <span className={`text-xs ${statLabel}`}>Warning</span>
                    </div>
                    <div className={`text-3xl font-bold ${statValue}`}>
                        {budgets.filter(b => {
                            const progress = getBudgetProgress(b.category);
                            return progress?.percentage >= 70 && progress?.percentage < 100;
                        }).length}
                    </div>
                    <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">Near limit</div>
                </div>

                <div className={`${statCardBg} rounded-xl border p-5 transition-colors duration-300`}>
                    <div className="flex items-center justify-between mb-3">
                        <FiAlertCircle className={`w-5 h-5 ${statLabel}`} />
                        <span className={`text-xs ${statLabel}`}>Critical</span>
                    </div>
                    <div className={`text-3xl font-bold ${statValue}`}>
                        {budgets.filter(b => {
                            const progress = getBudgetProgress(b.category);
                            return progress?.isOverBudget;
                        }).length}
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400 mt-1">Over budget</div>
                </div>
            </div>

            {/* Budget Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {budgets.map(budget => {
                    const progress = getBudgetProgress(budget.category);
                    if (!progress) return null;

                    const isOverBudget = progress.isOverBudget;
                    const percentage = Math.min(progress.percentage, 100);
                    const ringColor = getRingColor(percentage, isOverBudget);
                    const statusColor = getStatusColor(percentage, isOverBudget);
                    const statusText = getStatusText(percentage, isOverBudget);
                    const projection = calculateProjection(progress.spent, progress.amount);

                    return (
                        <div
                            key={budget.budget_id || budget.id}
                            className={`${budgetCardBg} rounded-xl border overflow-hidden transition-colors duration-300`}
                        >
                            <div className="p-5">
                                {/* Category and Actions - Actions always visible */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`text-lg font-semibold ${categoryText}`}>{budget.category}</h3>
                                            <span className={`text-xs font-medium ${statusColor}`}>
                                                {statusText}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-3 text-xs ${metaText}`}>
                                            <span className="flex items-center gap-1">
                                                <FiCalendar className="w-3 h-3" />
                                                {new Date().toLocaleString('default', { month: 'long' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiClock className="w-3 h-3" />
                                                Monthly
                                            </span>
                                        </div>
                                    </div>

                                    {/* Buttons always visible */}
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setEditingBudget(budget)}
                                            className={`p-1.5 ${editButton} rounded-lg transition-colors duration-200`}
                                        >
                                            <FiEdit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm({ id: budget.budget_id || budget.id, category: budget.category })}
                                            className={`p-1.5 ${deleteButton} rounded-lg transition-colors duration-200 hover:${deleteButtonHover}`}
                                        >
                                            <FiTrash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Main Content with Circular Progress */}
                                <div className="flex items-center gap-5 mb-5">
                                    <div className="relative flex-shrink-0">
                                        <CircularProgress percentage={percentage} size={90} strokeWidth={7} color={ringColor} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={`text-xl font-bold ${amountText}`}>{Math.round(percentage)}%</span>
                                            <span className={`text-xs ${metaText}`}>used</span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <div className={`text-xs ${metaText} mb-0.5`}>Spent</div>
                                            <div className={`text-xl font-bold ${amountText}`}>{formatCurrency(progress.spent)}</div>
                                        </div>
                                        <div>
                                            <div className={`text-xs ${metaText} mb-0.5`}>Budget</div>
                                            <div className={`text-base font-medium ${budgetAmountText}`}>{formatCurrency(progress.amount)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Stats */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className={`${statDetailBg} rounded-lg p-2.5 transition-colors duration-300`}>
                                        <div className="flex items-center gap-1 mb-1">
                                            <FiTrendingUp className={`w-3 h-3 ${metaText}`} />
                                            <span className={`text-xs ${metaText}`}>Daily avg</span>
                                        </div>
                                        <div className={`text-sm font-semibold ${statDetailText}`}>
                                            {formatCurrency(projection.dailyAvg)}
                                        </div>
                                    </div>
                                    <div className={`${statDetailBg} rounded-lg p-2.5 transition-colors duration-300`}>
                                        <div className="flex items-center gap-1 mb-1">
                                            <FiPieChart className={`w-3 h-3 ${metaText}`} />
                                            <span className={`text-xs ${metaText}`}>Projected</span>
                                        </div>
                                        <div className={`text-sm font-semibold ${projection.isOverProjection ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-emerald-400' : 'text-emerald-600')}`}>
                                            {formatCurrency(projection.projected)}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-3">
                                    <div className={`flex justify-between text-xs ${metaText} mb-1`}>
                                        <span>Progress</span>
                                        <span>{formatCurrency(progress.remaining)} remaining</span>
                                    </div>
                                    <div className={`h-1.5 ${progressBarBg} rounded-full overflow-hidden`}>
                                        <div
                                            style={{ width: `${percentage}%`, backgroundColor: ringColor }}
                                            className="h-full rounded-full transition-all duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Insights Section - Always visible */}
                                <div className={`pt-3 ${insightBorder} border-t`}>
                                    <div className="flex items-start gap-2">
                                        <FiShield className={`w-3.5 h-3.5 ${metaText} flex-shrink-0 mt-0.5`} />
                                        <div className={`text-xs ${insightText} leading-relaxed`}>
                                            {isOverBudget ? (
                                                <>Exceeded budget by {formatCurrency(Math.abs(progress.remaining))}</>
                                            ) : percentage >= 80 ? (
                                                <>{formatCurrency(progress.remaining)} left for the month</>
                                            ) : percentage >= 50 ? (
                                                <>Daily spending: {formatCurrency(projection.dailyAvg)}</>
                                            ) : (
                                                <>Well within budget with {formatCurrency(progress.remaining)} left</>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className={`fixed inset-0 ${modalOverlay} flex items-center justify-center z-50 animate-fadeIn`}>
                    <div className={`${modalBg} rounded-xl p-6 max-w-md mx-4 shadow-xl transition-colors duration-300`}>
                        <div className="text-center">
                            <div className={`w-12 h-12 ${isDark ? 'bg-red-900/30' : 'bg-red-50'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <FiTrash2 className={`w-5 h-5 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                            </div>
                            <h3 className={`text-lg font-semibold ${modalTitle} mb-2`}>Delete budget?</h3>
                            <p className={`text-sm ${modalText} mb-6`}>
                                Delete budget for <span className={`font-medium ${modalCategory}`}>{deleteConfirm.category}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className={`flex-1 px-4 py-2 border rounded-lg ${cancelBtn} transition-colors text-sm font-medium`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        deleteBudget(deleteConfirm.id);
                                        setDeleteConfirm(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Budget Modal */}
            {editingBudget && (
                <div className={`fixed inset-0 ${modalOverlay} flex items-center justify-center z-50 animate-fadeIn`}>
                    <div className={`${modalBg} rounded-xl max-w-md w-full mx-4 shadow-xl transition-colors duration-300`}>
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <FiEdit2 className={`w-4 h-4 ${metaText}`} />
                                <h3 className={`text-lg font-semibold ${modalTitle}`}>Edit budget</h3>
                            </div>
                            <SetBudgetForm
                                editBudget={editingBudget}
                                onClose={() => setEditingBudget(null)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}