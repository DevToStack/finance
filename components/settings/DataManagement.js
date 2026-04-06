"use client";

import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { FiDownload, FiUpload, FiTrash2, FiAlertCircle } from 'react-icons/fi';

export default function DataManagement() {
    const { exportData, importData, transactions, budgets } = useFinance();
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [importStatus, setImportStatus] = useState(null);
    const {isDark } = useTheme();


    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const success = importData(e.target.result);
                if (success) {
                    setImportStatus({ type: 'success', message: 'Data imported successfully!' });
                    setTimeout(() => setImportStatus(null), 3000);
                } else {
                    setImportStatus({ type: 'error', message: 'Failed to import data. Invalid file format.' });
                    setTimeout(() => setImportStatus(null), 3000);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleExport = () => {
        exportData();
    };

    const handleDeleteAllData = () => {
        if (confirm('Are you absolutely sure? This will delete ALL your financial data permanently.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const dataSize = JSON.stringify({ transactions, budgets }).length;
    const dataSizeKB = (dataSize / 1024).toFixed(2);

    // Dynamic classes based on theme
    const cardBg = isDark ? 'bg-gray-950' : 'bg-white';
    const borderColor = isDark ? 'border-gray-800' : 'border-gray-100';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
    const textTertiary = isDark ? 'text-gray-500' : 'text-gray-500';
    const infoBg = isDark ? 'bg-gray-800/50' : 'bg-gray-50';
    const statValue = isDark ? 'text-white' : 'text-gray-800';
    const statLabel = isDark ? 'text-gray-400' : 'text-gray-600';
    const actionCardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    const dangerZoneBg = isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200';
    const dangerTitle = isDark ? 'text-red-400' : 'text-red-800';
    const dangerText = isDark ? 'text-red-300' : 'text-red-600';
    const modalBg = isDark ? 'bg-gray-900' : 'bg-white';
    const modalText = isDark ? 'text-gray-300' : 'text-gray-600';
    const cancelBtnBg = isDark ? 'hover:bg-gray-800 border-gray-700 text-gray-300' : 'hover:bg-gray-50 border-gray-200 text-gray-700';

    const statusStyles = {
        success: {
            bg: isDark ? 'bg-green-900/20' : 'bg-green-50',
            text: isDark ? 'text-green-400' : 'text-green-800',
            border: isDark ? 'border-green-800' : 'border-green-200'
        },
        error: {
            bg: isDark ? 'bg-red-900/20' : 'bg-red-50',
            text: isDark ? 'text-red-400' : 'text-red-800',
            border: isDark ? 'border-red-800' : 'border-red-200'
        }
    };

    return (
        <div className={`${cardBg} rounded-xl shadow-sm p-6`}>
            <h3 className={`text-xl font-semibold mb-6 ${textPrimary}`}>Data Management</h3>

            <div className="space-y-6">
                {/* Data Info */}
                <div className={`${infoBg} rounded-lg p-4`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className={`text-sm ${statLabel}`}>Total Data Size</p>
                            <p className={`text-2xl font-bold ${statValue}`}>{dataSizeKB} KB</p>
                        </div>
                        <div>
                            <p className={`text-sm ${statLabel}`}>Transactions</p>
                            <p className={`text-2xl font-bold ${statValue}`}>{transactions.length}</p>
                        </div>
                        <div>
                            <p className={`text-sm ${statLabel}`}>Budgets</p>
                            <p className={`text-2xl font-bold ${statValue}`}>{budgets.length}</p>
                        </div>
                    </div>
                </div>

                {/* Import/Export Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`${actionCardBg} rounded-lg p-4 border`}>
                        <div className="flex items-center gap-3 mb-3">
                            <FiDownload className="w-5 h-5 text-blue-500" />
                            <h4 className={`font-semibold ${textPrimary}`}>Export Data</h4>
                        </div>
                        <p className={`text-sm ${textSecondary} mb-3`}>
                            Download all your financial data as a JSON file for backup or migration
                        </p>
                        <button
                            onClick={handleExport}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Export to JSON
                        </button>
                    </div>

                    <div className={`${actionCardBg} rounded-lg p-4 border`}>
                        <div className="flex items-center gap-3 mb-3">
                            <FiUpload className="w-5 h-5 text-green-500" />
                            <h4 className={`font-semibold ${textPrimary}`}>Import Data</h4>
                        </div>
                        <p className={`text-sm ${textSecondary} mb-3`}>
                            Import previously exported data (JSON format only)
                        </p>
                        <label className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center cursor-pointer block">
                            Import from JSON
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {/* Import Status */}
                {importStatus && (
                    <div className={`p-3 rounded-lg border ${statusStyles[importStatus.type].bg} ${statusStyles[importStatus.type].text} ${statusStyles[importStatus.type].border}`}>
                        {importStatus.message}
                    </div>
                )}

                {/* Danger Zone */}
                <div className={`border-2 ${dangerZoneBg} rounded-lg p-4`}>
                    <div className="flex items-center gap-3 mb-3">
                        <FiTrash2 className="w-5 h-5 text-red-500" />
                        <h4 className={`font-semibold ${dangerTitle}`}>Danger Zone</h4>
                    </div>
                    <p className={`text-sm ${dangerText} mb-3`}>
                        Permanently delete all your financial data. This action cannot be undone.
                    </p>
                    <button
                        onClick={() => setShowConfirmDelete(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Delete All Data
                    </button>
                </div>

                {/* Confirmation Modal */}
                {showConfirmDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className={`${modalBg} rounded-xl max-w-md mx-4 p-6`}>
                            <div className="flex items-center gap-3 mb-4">
                                <FiAlertCircle className="w-6 h-6 text-red-500" />
                                <h3 className={`text-xl font-semibold ${textPrimary}`}>Confirm Deletion</h3>
                            </div>
                            <p className={`${modalText} mb-6`}>
                                Are you sure you want to delete ALL your financial data? This action is permanent and cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmDelete(false)}
                                    className={`flex-1 px-4 py-2 border rounded-lg ${cancelBtnBg}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAllData}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Yes, Delete Everything
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}