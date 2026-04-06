// components/IncomeTable.js
"use client";

import { useFinance } from '@/context/FinanceContext';
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
    FiEdit2,
    FiTrash2,
    FiCalendar,
    FiTag,
    FiDollarSign,
    FiTrendingUp,
    FiSearch,
    FiChevronLeft,
    FiChevronRight,
    FiAlertCircle,
    FiX,
    FiInfo,
    FiDownload
} from 'react-icons/fi';

export default function IncomeTable() {
    const { transactions, deleteTransaction } = useFinance();
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedRows, setSelectedRows] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [editingIncome, setEditingIncome] = useState(null);
    const { isDark } = useTheme();

    // Get incomes
    const incomes = transactions
        .filter(t => t.type === 'income')
        .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));

    // Apply filters and search
    const filteredIncomes = incomes
        .filter(i => filterCategory === 'all' || i.category === filterCategory)
        .filter(i => searchTerm === '' ||
            i.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.amount?.toString().includes(searchTerm)
        )
        .sort((a, b) => {
            if (sortBy === 'date') {
                return sortOrder === 'desc'
                    ? new Date(b.transaction_date) - new Date(a.transaction_date)
                    : new Date(a.transaction_date) - new Date(b.transaction_date);
            }
            if (sortBy === 'amount') {
                return sortOrder === 'desc'
                    ? parseFloat(b.amount) - parseFloat(a.amount)
                    : parseFloat(a.amount) - parseFloat(b.amount);
            }
            if (sortBy === 'category') {
                return sortOrder === 'desc'
                    ? b.category?.localeCompare(a.category)
                    : a.category?.localeCompare(b.category);
            }
            return 0;
        });

    // Pagination
    const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);
    const paginatedIncomes = filteredIncomes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const categories = [...new Set(incomes.map(i => i.category))];
    const totalIncome = filteredIncomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const averageIncome = filteredIncomes.length > 0 ? totalIncome / filteredIncomes.length : 0;

    const handleDelete = (id) => {
        deleteTransaction(id);
        setShowDeleteConfirm(null);
        setSelectedRows(prev => prev.filter(rowId => rowId !== id));
    };

    const handleEdit = (income) => {
        setEditingIncome(income);
        console.log('Edit income:', income);
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedRows.length === paginatedIncomes.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(paginatedIncomes.map(i => i.transaction_id));
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedRows.length} income entries?`)) {
            selectedRows.forEach(id => deleteTransaction(id));
            setSelectedRows([]);
        }
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilterCategory('all');
        setSearchTerm('');
        setCurrentPage(1);
    };

    const SortIcon = ({ column }) => {
        if (sortBy !== column) return null;
        return (
            <span className="ml-1 inline-block text-xs">
                {sortOrder === 'desc' ? '↓' : '↑'}
            </span>
        );
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Description', 'Category', 'Amount', 'Notes'];
        const csvData = filteredIncomes.map(i => [
            formatDate(i.transaction_date),
            i.description || '',
            i.category,
            i.amount,
            i.notes || ''
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `income_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Helper function to format transaction ID safely
    const formatTransactionId = (id) => {
        if (!id) return 'N/A';
        const idString = String(id);
        return idString.slice(-6);
    };

    // Dynamic classes based on theme
    const statCard = {
        total: isDark ? 'bg-gradient-to-br from-green-950/30 to-emerald-950/30 border-green-800' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100',
        totalText: isDark ? 'text-green-300' : 'text-green-700',
        totalValue: isDark ? 'text-green-200' : 'text-green-700',
        totalIconBg: isDark ? 'bg-green-900/30' : 'bg-green-100',
        totalIcon: isDark ? 'text-green-400' : 'text-green-600',

        transactions: isDark ? 'bg-gradient-to-br from-blue-950/30 to-indigo-950/30 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100',
        transactionsText: isDark ? 'text-blue-300' : 'text-blue-700',
        transactionsValue: isDark ? 'text-blue-200' : 'text-blue-700',
        transactionsIconBg: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
        transactionsIcon: isDark ? 'text-blue-400' : 'text-blue-600',

        average: isDark ? 'bg-gradient-to-br from-purple-950/30 to-pink-950/30 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100',
        averageText: isDark ? 'text-purple-300' : 'text-purple-700',
        averageValue: isDark ? 'text-purple-200' : 'text-purple-700',
        averageIconBg: isDark ? 'bg-purple-900/30' : 'bg-purple-100',
        averageIcon: isDark ? 'text-purple-400' : 'text-purple-600'
    };

    const filterBarBg = isDark ? 'bg-gray-950 border-gray-700' : 'bg-white border-gray-200';
    const inputBg = isDark ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900';
    const inputFocus = isDark ? 'focus:ring-green-600' : 'focus:ring-green-500';
    const categoryBtnActive = isDark ? 'bg-green-700 text-white' : 'bg-green-500 text-white';
    const categoryBtnInactive = isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    const actionBtn = isDark ? 'border-gray-700 text-gray-300 hover:text-gray-100' : 'border-gray-200 text-gray-600 hover:text-gray-800';

    const bulkActionBar = isDark ? 'bg-blue-950/30 border-blue-800' : 'bg-blue-50 border-blue-200';
    const bulkActionText = isDark ? 'text-blue-300' : 'text-blue-800';
    const bulkActionIcon = isDark ? 'text-blue-400' : 'text-blue-600';

    const tableBg = isDark ? 'bg-gray-950/50 border-gray-900' : 'bg-white border-gray-200';
    const tableHeaderBg = isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200';
    const tableHeaderText = isDark ? 'text-gray-400' : 'text-gray-500';
    const tableRowHover = isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50';
    const tableBorder = isDark ? 'divide-gray-700' : 'divide-gray-100';
    const tableTextPrimary = isDark ? 'text-white' : 'text-gray-900';
    const tableTextSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const tableIdText = isDark ? 'text-gray-500' : 'text-gray-400';
    const categoryBadge = isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700';
    const amountText = isDark ? 'text-green-400' : 'text-green-600';
    const editBtn = isDark ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 border-blue-800' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200';
    const deleteBtn = isDark ? 'bg-red-900/30 text-red-300 hover:bg-red-800/50 border-red-800' : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200';

    const paginationBg = isDark ? 'bg-gray-950/50 border-gray-700' : 'bg-gray-50 border-gray-200';
    const paginationText = isDark ? 'text-gray-400' : 'text-gray-600';
    const paginationBtn = isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50';
    const paginationBtnDisabled = isDark ? 'opacity-50' : 'opacity-50';
    const paginationActive = isDark ? 'bg-green-700 text-white' : 'bg-green-500 text-white';
    const paginationInactive = isDark ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50';

    const modalOverlay = isDark ? 'bg-black/50' : 'bg-black/50';
    const modalBg = isDark ? 'bg-gray-950' : 'bg-white';
    const modalBorder = isDark?'border-gray-900':'border-gray-100';
    const modalTitle = isDark ? 'text-white' : 'text-gray-900';
    const modalText = isDark ? 'text-gray-400' : 'text-gray-500';
    const modalIconBg = isDark ? 'bg-red-900/30' : 'bg-red-100';
    const modalIcon = isDark ? 'text-red-400' : 'text-red-600';
    const modalCancelBtn = isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50';
    const modalDeleteBtn = isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-500 hover:bg-red-600';

    const emptyStateIconBg = isDark ? 'bg-gray-800' : 'bg-gray-50';
    const emptyStateIcon = isDark ? 'text-gray-600' : 'text-gray-300';
    const emptyStateTitle = isDark ? 'text-gray-300' : 'text-gray-500';
    const emptyStateSubtitle = isDark ? 'text-gray-500' : 'text-gray-400';

    return (
        <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`${statCard.total} rounded-xl p-4 border transition-all duration-300`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${statCard.totalText} font-medium uppercase tracking-wide`}>Total Income</p>
                            <p className={`text-2xl font-bold ${statCard.totalValue} mt-1`}>{formatCurrency(totalIncome)}</p>
                        </div>
                        <div className={`w-10 h-10 ${statCard.totalIconBg} rounded-full flex items-center justify-center`}>
                            <FiDollarSign className={`w-5 h-5 ${statCard.totalIcon}`} />
                        </div>
                    </div>
                </div>

                <div className={`${statCard.transactions} rounded-xl p-4 border transition-all duration-300`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${statCard.transactionsText} font-medium uppercase tracking-wide`}>Transactions</p>
                            <p className={`text-2xl font-bold ${statCard.transactionsValue} mt-1`}>{filteredIncomes.length}</p>
                        </div>
                        <div className={`w-10 h-10 ${statCard.transactionsIconBg} rounded-full flex items-center justify-center`}>
                            <FiTrendingUp className={`w-5 h-5 ${statCard.transactionsIcon}`} />
                        </div>
                    </div>
                </div>

                <div className={`${statCard.average} rounded-xl p-4 border transition-all duration-300`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs ${statCard.averageText} font-medium uppercase tracking-wide`}>Average Income</p>
                            <p className={`text-2xl font-bold ${statCard.averageValue} mt-1`}>{formatCurrency(averageIncome)}</p>
                        </div>
                        <div className={`w-10 h-10 ${statCard.averageIconBg} rounded-full flex items-center justify-center`}>
                            <FiTag className={`w-5 h-5 ${statCard.averageIcon}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar with Export Options */}
            <div className={`${filterBarBg} rounded-xl border p-4 transition-all duration-300`}>
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'} w-4 h-4`} />
                        <input
                            type="text"
                            placeholder="Search by description, category, or amount..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputFocus} focus:border-transparent text-sm ${inputBg} transition-all duration-200`}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                        <button
                            onClick={() => {
                                setFilterCategory('all');
                                setCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-1 ${filterCategory === 'all' ? categoryBtnActive : categoryBtnInactive
                                }`}
                        >
                            <FiTag className="w-3.5 h-3.5" />
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setFilterCategory(cat);
                                    setCurrentPage(1);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${filterCategory === cat ? categoryBtnActive : categoryBtnInactive
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {(filterCategory !== 'all' || searchTerm) && (
                            <button
                                onClick={clearFilters}
                                className={`px-3 py-1.5 text-sm transition-all duration-200 flex items-center gap-1 border rounded-lg ${actionBtn}`}
                            >
                                <FiX className="w-4 h-4" />
                                Clear
                            </button>
                        )}
                        <button
                            onClick={exportToCSV}
                            className={`px-3 py-1.5 text-sm transition-all duration-200 flex items-center gap-1 border rounded-lg ${actionBtn}`}
                        >
                            <FiDownload className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedRows.length > 0 && (
                <div className={`${bulkActionBar} rounded-lg p-3 flex items-center justify-between border animate-fadeIn transition-all duration-300`}>
                    <div className="flex items-center gap-2">
                        <FiInfo className={`w-4 h-4 ${bulkActionIcon}`} />
                        <span className={`text-sm ${bulkActionText}`}>
                            {selectedRows.length} transaction{selectedRows.length !== 1 ? 's' : ''} selected
                        </span>
                    </div>
                    <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                    >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        Delete Selected
                    </button>
                </div>
            )}

            {/* Income Table */}
            <div className={`${tableBg} rounded-xl border overflow-hidden transition-all duration-300`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`${tableHeaderBg} border-b transition-colors duration-300`}>
                            <tr>
                                <th className="w-10 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.length === paginatedIncomes.length && paginatedIncomes.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                                    />
                                </th>
                                <th
                                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className={`flex items-center gap-1 ${tableHeaderText}`}>
                                        <FiCalendar className="w-3.5 h-3.5" />
                                        Date
                                        <SortIcon column="date" />
                                    </div>
                                </th>
                                <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${tableHeaderText}`}>
                                    Description
                                </th>
                                <th
                                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                                    onClick={() => handleSort('category')}
                                >
                                    <div className={`flex items-center gap-1 ${tableHeaderText}`}>
                                        <FiTag className="w-3.5 h-3.5" />
                                        Category
                                        <SortIcon column="category" />
                                    </div>
                                </th>
                                <th
                                    className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors"
                                    onClick={() => handleSort('amount')}
                                >
                                    <div className={`flex items-center justify-end gap-1 ${tableHeaderText}`}>
                                        <FiDollarSign className="w-3.5 h-3.5" />
                                        Amount
                                        <SortIcon column="amount" />
                                    </div>
                                </th>
                                <th className={`text-center px-6 py-3 text-xs font-semibold uppercase tracking-wider ${tableHeaderText}`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${tableBorder}`}>
                            {paginatedIncomes.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className={`w-16 h-16 ${emptyStateIconBg} rounded-full flex items-center justify-center mb-3`}>
                                                <FiAlertCircle className={`w-8 h-8 ${emptyStateIcon}`} />
                                            </div>
                                            <p className={`font-medium ${emptyStateTitle}`}>No income entries found</p>
                                            <p className={`text-sm ${emptyStateSubtitle} mt-1`}>
                                                {searchTerm || filterCategory !== 'all'
                                                    ? 'Try adjusting your filters'
                                                    : 'Add your first income transaction'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedIncomes.map(income => (
                                    <tr key={income.transaction_id} className={`${tableRowHover} transition-colors duration-200`}>
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(income.transaction_id)}
                                                onChange={() => handleSelectRow(income.transaction_id)}
                                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm font-medium ${tableTextPrimary}`}>
                                                {formatDate(income.transaction_date)}
                                            </div>
                                            <div className={`text-xs ${tableIdText} mt-0.5`}>
                                                ID: {formatTransactionId(income.transaction_id)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm ${tableTextPrimary}`}>
                                                {income.description || 'No description'}
                                            </div>
                                            {income.notes && (
                                                <div className={`text-xs ${tableIdText} mt-0.5 line-clamp-1`}>
                                                    📝 {income.notes}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${categoryBadge}`}>
                                                <FiTag className="w-3 h-3" />
                                                {income.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`text-sm font-bold ${amountText}`}>
                                                +{formatCurrency(income.amount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(income)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border ${editBtn}`}
                                                >
                                                    <FiEdit2 className="w-3.5 h-3.5" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(income.transaction_id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border ${deleteBtn}`}
                                                >
                                                    <FiTrash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredIncomes.length > 0 && (
                    <div className={`px-6 py-4 border-t ${paginationBg} transition-colors duration-300`}>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className={`text-sm ${paginationText}`}>
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                {Math.min(currentPage * itemsPerPage, filteredIncomes.length)} of{' '}
                                {filteredIncomes.length} entries
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 flex items-center gap-1 ${paginationBtn} ${currentPage === 1 ? paginationBtnDisabled : ''}`}
                                >
                                    <FiChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-8 h-8 text-sm rounded-lg transition-all duration-200 ${currentPage === pageNum ? paginationActive : paginationInactive
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 flex items-center gap-1 ${paginationBtn} ${currentPage === totalPages ? paginationBtnDisabled : ''}`}
                                >
                                    Next
                                    <FiChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className={`fixed inset-0 ${modalOverlay} flex items-center justify-center z-50 animate-fadeIn`}>
                    <div className={`${modalBg} ${modalBorder} border rounded-xl p-6 max-w-md mx-4 shadow-xl transition-all duration-300`}>
                        <div className="text-center">
                            <div className={`w-12 h-12 ${modalIconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                <FiTrash2 className={`w-6 h-6 ${modalIcon}`} />
                            </div>
                            <h3 className={`text-lg font-semibold ${modalTitle} mb-2`}>Delete Income Entry?</h3>
                            <p className={`text-sm ${modalText} mb-6`}>
                                Are you sure you want to delete this income entry? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${modalCancelBtn}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${modalDeleteBtn}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}