"use client";

import { useFinance } from '@/context/FinanceContext';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import ExpenseTable from '@/components/tables/ExpenseTable';
import AddExpenseForm from '@/components/forms/AddExpenseForm';
import ExpenseSummary from '@/components/dashboard/ExpenseSummary';
import { FiPlus } from 'react-icons/fi';

export default function ExpenseTab() {
    const { totalExpense, expenseByCategory } = useFinance();
    const [showAddForm, setShowAddForm] = useState(false);
    const { isDark } = useTheme();

    // Dynamic classes based on theme
    const headerTitle = isDark ? 'text-white' : 'text-gray-800';
    const headerSubtitle = isDark ? 'text-gray-400' : 'text-gray-500';
    const addButton = isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={`text-2xl font-bold ${headerTitle}`}>Expenses</h2>
                    <p className={`${headerSubtitle} mt-1`}>Track and manage your spending</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className={`px-4 py-2 ${addButton} text-white rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm`}
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Expense</span>
                </button>
            </div>

            {/* Expense Summary Cards */}
            <ExpenseSummary totalExpense={totalExpense} categories={expenseByCategory} />

            {/* Add Expense Modal */}
            {showAddForm && <AddExpenseForm onClose={() => setShowAddForm(false)} />}

            {/* Expenses Table */}
            <ExpenseTable />
        </div>
    );
}