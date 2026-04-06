"use client";

import { useState, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import { FiX } from 'react-icons/fi';

export default function SetBudgetForm({ onClose, editBudget = null }) {
    const { addBudget, updateBudget, categories } = useFinance();
    const { isDark } = useTheme();

    // Initialize with default values
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        month: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Populate form when editBudget changes
    useEffect(() => {
        if (editBudget) {
            console.log('Populating form with budget:', editBudget);
            setFormData({
                category: editBudget.category || categories.expense[0],
                amount: editBudget.amount || '',
                month: editBudget.month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
            });
        } else {
            // Reset form for new budget
            setFormData({
                category: categories.expense[0],
                amount: '',
                month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
            });
        }
    }, [editBudget, categories.expense]);

    const theme = {
        overlay: isDark ? 'bg-white/10' : 'bg-black/10',
        modal: isDark ? 'bg-black border border-gray-700' : 'bg-white',
        border: isDark ? 'border-gray-900' : 'border-gray-200',
        text: {
            primary: isDark ? 'text-white' : 'text-gray-900',
            secondary: isDark ? 'text-gray-400' : 'text-gray-600',
            label: isDark ? 'text-gray-300' : 'text-gray-700',
            error: isDark ? 'text-red-400' : 'text-red-500',
            cancel: isDark ? 'text-gray-300' : 'text-gray-700',
        },
        input: isDark ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900',
        focusRing: isDark ? 'focus:ring-purple-600' : 'focus:ring-purple-500',
        closeButton: isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100',
        cancelButton: isDark ? 'hover:bg-gray-900 border-gray-800' : 'hover:bg-gray-50 border-gray-200',
        submitButton: isDark ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-500 hover:bg-purple-600',
        dollarSign: isDark ? 'text-gray-400' : 'text-gray-500',
        tip: isDark ? 'bg-purple-900/30 border-purple-800 text-purple-300' : 'bg-purple-50 text-purple-800',
        disabledSelect: isDark ? 'opacity-70 cursor-not-allowed' : 'opacity-70 cursor-not-allowed',
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Please enter a valid budget amount';
        }
        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                if (editBudget) {
                    // Get the budget ID
                    const budgetId = editBudget.budget_id || editBudget.id;
                    console.log('Updating budget ID:', budgetId);
                    console.log('Update data:', {
                        amount: parseFloat(formData.amount),
                        category: formData.category,
                        month: formData.month
                    });

                    await updateBudget(budgetId, {
                        amount: parseFloat(formData.amount),
                        category: formData.category,
                        month: formData.month
                    });
                    console.log('Budget updated successfully');
                } else {
                    await addBudget({
                        category: formData.category,
                        amount: parseFloat(formData.amount),
                        month: formData.month
                    });
                }
                onClose();
            } catch (error) {
                console.error('Error saving budget:', error);
                alert('Failed to save budget. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className={`fixed inset-0 ${theme.overlay} flex items-center justify-center z-50 transition-colors duration-300`}>
            <div className={`${theme.modal} rounded-xl w-full max-w-md mx-4 shadow-xl transition-colors duration-300`}>
                <div className={`flex justify-between items-center p-6 border-b ${theme.border}`}>
                    <h3 className={`text-xl font-semibold ${theme.text.primary}`}>
                        {editBudget ? 'Edit Budget' : 'Set Monthly Budget'}
                    </h3>
                    <button
                        onClick={onClose}
                        className={`p-1 ${theme.closeButton} rounded-lg transition-colors duration-200`}
                    >
                        <FiX className={`w-5 h-5 ${theme.text.secondary}`} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className={`block text-sm font-medium ${theme.text.label} mb-2`}>Category *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className={`w-full px-3 py-2 ${theme.input} border rounded-lg focus:ring-2 ${theme.focusRing} focus:outline-none transition-colors duration-200 ${editBudget ? theme.disabledSelect : ''}`}
                            disabled={!!editBudget}
                        >
                            {categories.expense.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className={`${theme.text.error} text-sm mt-1`}>{errors.category}</p>}
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${theme.text.label} mb-2`}>Budget Amount *</label>
                        <div className="relative">
                            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.dollarSign}`}>$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className={`w-full pl-8 pr-3 py-2 ${theme.input} border rounded-lg focus:ring-2 ${theme.focusRing} focus:outline-none transition-colors duration-200`}
                                placeholder="0.00"
                            />
                        </div>
                        {errors.amount && <p className={`${theme.text.error} text-sm mt-1`}>{errors.amount}</p>}
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${theme.text.label} mb-2`}>Budget Month</label>
                        <input
                            type="month"
                            value={formData.month}
                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            className={`w-full px-3 py-2 ${theme.input} border rounded-lg focus:ring-2 ${theme.focusRing} focus:outline-none transition-colors duration-200`}
                        />
                    </div>

                    <div className={`${theme.tip} p-3 rounded-lg border transition-colors duration-300`}>
                        <p className="text-sm">
                            💡 Tip: Set realistic budgets based on your spending history
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className={`flex-1 px-4 py-2 border rounded-lg ${theme.cancelButton} ${theme.text.cancel} transition-colors duration-200`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 px-4 py-2 ${theme.submitButton} text-white rounded-lg transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Saving...' : (editBudget ? 'Update Budget' : 'Set Budget')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}