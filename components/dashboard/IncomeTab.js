"use client";

import { useFinance } from '@/context/FinanceContext';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import IncomeTable from '@/components/tables/IncomeTable';
import AddIncomeForm from '@/components/forms/AddIncomeForm';
import IncomeSummary from '@/components/dashboard/IncomeSummary';
import IncomeChart from '@/components/charts/IncomeChart';
import { FiPlus } from 'react-icons/fi';

export default function IncomeTab() {
    const { totalIncome, incomeByCategory } = useFinance();
    const [showAddForm, setShowAddForm] = useState(false);
    const { isDark } = useTheme();

    // Dynamic classes based on theme
    const headerTitle = isDark ? 'text-white' : 'text-gray-800';
    const headerSubtitle = isDark ? 'text-gray-400' : 'text-gray-500';
    const addButton = isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={`text-2xl font-bold ${headerTitle}`}>Income</h2>
                    <p className={`${headerSubtitle} mt-1`}>Track your earnings and revenue</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className={`px-4 py-2 ${addButton} text-white rounded-lg flex items-center gap-2 transition-all duration-200 shadow-sm`}
                >
                    <FiPlus className="w-4 h-4" />
                    <span>Add Income</span>
                </button>
            </div>

            {/* Income Summary */}
            <IncomeSummary totalIncome={totalIncome} categories={incomeByCategory} />

            {/* Income Chart */}
            <IncomeChart />

            {/* Income Table */}
            <IncomeTable />

            {/* Add Income Modal */}
            {showAddForm && <AddIncomeForm onClose={() => setShowAddForm(false)} />}
        </div>
    );
}