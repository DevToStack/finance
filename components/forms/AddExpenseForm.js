"use client";

import { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import { FiX } from 'react-icons/fi';

export default function AddExpenseForm({ onClose }) {
    const { addTransaction, categories } = useFinance();
    const { isDark } = useTheme();
    const [formData, setFormData] = useState({
        amount: '',
        category: categories.expense[0],
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [errors, setErrors] = useState({});

    // Theme-based classes
    const overlayBg = isDark ? 'bg-black/70' : 'bg-black/10';
    const modalBg = isDark ? 'bg-black' : 'bg-white';
    const borderColor = isDark ? 'border-gray-900' : 'border-gray-200';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
    const labelColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const inputBg = isDark ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900';
    const inputFocusRing = isDark ? 'focus:ring-blue-600' : 'focus:ring-blue-500';
    const closeButtonHover = isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100';
    const cancelButtonBg = isDark ? 'hover:bg-gray-900 border-gray-800' : 'hover:bg-gray-50 border-gray-200';
    const cancelButtonText = isDark ? 'text-gray-300' : 'text-gray-700';
    const errorText = isDark ? 'text-red-400' : 'text-red-500';
    const submitButtonBg = isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';

    const validateForm = () => {
        const newErrors = {};
        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Please enter a description';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            addTransaction({
                type: 'expense',
                amount: parseFloat(formData.amount),
                category: formData.category,
                description: formData.description,
                date: new Date(formData.date).toISOString()
            });
            onClose();
        }
    };

    return (
        <div className={`fixed inset-0 ${overlayBg} flex items-center justify-center z-50`}>
            <div className={`${modalBg} border rounded-xl w-full max-w-md mx-4 shadow-xl`}>
                <div className={`flex justify-between items-center p-6 border-b ${borderColor}`}>
                    <h3 className={`text-xl font-semibold ${textPrimary}`}>Add Expense</h3>
                    <button
                        onClick={onClose}
                        className={`p-1 ${closeButtonHover} rounded-lg transition-colors duration-200`}
                    >
                        <FiX className={`w-5 h-5 ${textSecondary}`} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className={`block text-sm font-medium ${labelColor} mb-2`}>Amount *</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className={`w-full px-3 py-2 ${inputBg} border rounded-lg focus:ring-2 ${inputFocusRing} focus:outline-none transition-colors duration-200`}
                            placeholder="0.00"
                        />
                        {errors.amount && <p className={`${errorText} text-sm mt-1`}>{errors.amount}</p>}
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${labelColor} mb-2`}>Category *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className={`w-full px-3 py-2 ${inputBg} border rounded-lg focus:ring-2 ${inputFocusRing} focus:outline-none transition-colors duration-200`}
                        >
                            {categories.expense.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${labelColor} mb-2`}>Description *</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className={`w-full px-3 py-2 ${inputBg} border rounded-lg focus:ring-2 ${inputFocusRing} focus:outline-none transition-colors duration-200`}
                            placeholder="e.g., Grocery shopping"
                        />
                        {errors.description && <p className={`${errorText} text-sm mt-1`}>{errors.description}</p>}
                    </div>

                    <div>
                        <label className={`block text-sm font-medium ${labelColor} mb-2`}>Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className={`w-full px-3 py-2 ${inputBg} border rounded-lg focus:ring-2 ${inputFocusRing} focus:outline-none transition-colors duration-200`}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 px-4 py-2 border rounded-lg ${cancelButtonBg} ${cancelButtonText} transition-colors duration-200`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-4 py-2 ${submitButtonBg} text-white rounded-lg transition-colors duration-200`}
                        >
                            Add Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}