// components/TransactionsList.js
"use client";
import { useState, useMemo } from 'react';
import {
    FiSearch, FiFilter, FiEdit2, FiTrash2, FiDownload,
    FiChevronLeft, FiChevronRight, FiCalendar, FiCheckCircle,
    FiClock
} from 'react-icons/fi';
import useStore from '@/lib/store';

const STATUS_BADGES = {
    completed: { bg: 'bg-green-100 dark:bg-green-950/30', text: 'text-green-700 dark:text-green-400', icon: FiCheckCircle },
    pending: { bg: 'bg-yellow-100 dark:bg-yellow-950/30', text: 'text-yellow-700 dark:text-yellow-400', icon: FiClock }
};

// Default status badge for missing or invalid status
const DEFAULT_STATUS_BADGE = { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', icon: FiClock };

const CATEGORY_COLORS = {
    'Salary': 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    'Freelance': 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    'Investments': 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
    'Food': 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
    'Rent': 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
    'Transport': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400',
    'Utilities': 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    'Shopping': 'bg-pink-100 text-pink-700 dark:bg-pink-950/30 dark:text-pink-400',
    'Entertainment': 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
    'Health': 'bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-400',
    'Education': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400'
};

export default function TransactionsList({ filterType = null, limit = null }) {
    const {
        transactions, role, searchTerm, typeFilter, categoryFilter,
        sortBy, currentPage, itemsPerPage, setSearchTerm, setTypeFilter,
        setCategoryFilter, setSortBy, setCurrentPage, setItemsPerPage,
        deleteTransaction, editTransaction, exportToCSV, getFilteredTransactions
    } = useStore();

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    // Apply filterType prop if provided
    const effectiveTypeFilter = filterType || typeFilter;

    const filteredTransactions = useMemo(() => {
        let filtered = getFilteredTransactions();
        if (filterType) {
            filtered = filtered.filter(t => t.type === filterType);
        }
        if (limit) {
            filtered = filtered.slice(0, limit);
        }
        return filtered;
    }, [getFilteredTransactions, filterType, limit]);

    const totalPages = limit ? 1 : Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTransactions = limit
        ? filteredTransactions
        : filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

    const categories = [...new Set(transactions.map(t => t.category))].sort();

    const handleEdit = (transaction) => {
        setEditingId(transaction.id);
        setEditForm(transaction);
    };

    const handleSaveEdit = () => {
        editTransaction(editingId, editForm);
        setEditingId(null);
    };

    const handleExport = () => {
        exportToCSV();
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setTypeFilter('all');
        setCategoryFilter('all');
        setCurrentPage(1);
    };

    // Helper function to safely get status badge
    const getStatusBadge = (status) => {
        return STATUS_BADGES[status] || DEFAULT_STATUS_BADGE;
    };

    return (
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
            <div className="p-4 border-b border-[hsl(var(--border))]">
                <div className="flex flex-col lg:flex-row gap-3 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${showFilters
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40'
                                    : 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                                }`}
                        >
                            <FiFilter className="w-4 h-4" />
                            Filters
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                        >
                            <FiDownload className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 border border-[hsl(var(--border))] rounded-lg">
                        <div className="flex flex-wrap gap-3 items-end">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Type</label>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                >
                                    <option value="all">All Types</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Category</label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Sort by</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                >
                                    <option value="date-desc">Newest First</option>
                                    <option value="date-asc">Oldest First</option>
                                    <option value="amount-desc">Highest Amount</option>
                                    <option value="amount-asc">Lowest Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Per page</label>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                    className="px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                            <button
                                onClick={handleClearFilters}
                                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                            >
                                Clear all
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-[hsl(var(--border))]">
                        <tr>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                            {role === 'admin' && <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(var(--border))]">
                        {paginatedTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={role === 'admin' ? 6 : 5} className="text-center py-12 text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <FiSearch className="w-8 h-8 text-gray-300" />
                                        <p>No transactions found</p>
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-all"
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedTransactions.map((transaction) => {
                                // Safely get status badge
                                const statusBadge = getStatusBadge(transaction.status);
                                const StatusIcon = statusBadge.icon;

                                return (
                                    <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                                        {editingId === transaction.id ? (
                                            <>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="date"
                                                        value={editForm.date}
                                                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                        className="px-2 py-1 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded text-sm w-full hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={editForm.description || ''}
                                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                        className="px-2 py-1 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded text-sm w-full hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                                        placeholder="Description"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={editForm.category}
                                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                                        className="px-2 py-1 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded text-sm w-full hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={editForm.status || 'pending'}
                                                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                        className="px-2 py-1 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded text-sm hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                                    >
                                                        <option value="completed">Completed</option>
                                                        <option value="pending">Pending</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={editForm.amount}
                                                        onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                                                        className="px-2 py-1 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded text-sm w-24 text-right hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button onClick={handleSaveEdit} className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mr-2 text-sm font-medium transition-colors">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">Cancel</button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <FiCalendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-[hsl(var(--foreground))]">
                                                            {new Date(transaction.date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                                                            {transaction.description || transaction.category}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{transaction.type === 'income' ? 'Income' : 'Expense'}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[transaction.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                        {transaction.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                                        {StatusIcon && <StatusIcon className="w-3 h-3" />}
                                                        {transaction.status ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-3 text-right text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                {role === 'admin' && (
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => handleEdit(transaction)}
                                                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                                                                title="Edit"
                                                            >
                                                                <FiEdit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteTransaction(transaction.id)}
                                                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                            </>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {filteredTransactions.length > 0 && !limit && (
                <div className="p-4 border-t border-[hsl(var(--border))]">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                            >
                                <FiChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--foreground))] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200"
                            >
                                <FiChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}