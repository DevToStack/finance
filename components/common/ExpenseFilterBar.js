"use client";

import { useFinance } from '@/context/FinanceContext';
import { useState, useEffect } from 'react';
import { FiCalendar, FiX, FiFilter, FiChevronDown } from 'react-icons/fi';

export default function ExpenseFilterBar() {
    const {
        selectedDateRange,
        setSelectedDateRange,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        transactions,
        categories
    } = useFinance();

    const [localSearch, setLocalSearch] = useState(searchQuery);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDateRange, setTempDateRange] = useState(selectedDateRange);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    // Calculate active filters count
    useEffect(() => {
        let count = 0;
        if (selectedCategory !== 'all') count++;
        if (searchQuery !== '') count++;

        const isDefaultDateRange =
            selectedDateRange.start.getDate() === 1 &&
            selectedDateRange.start.getMonth() === new Date().getMonth() &&
            selectedDateRange.end.toDateString() === new Date().toDateString();

        if (!isDefaultDateRange) count++;

        setActiveFiltersCount(count);
    }, [selectedCategory, searchQuery, selectedDateRange]);

    // Get unique categories from transactions
    const expenseCategories = ['all', ...new Set(
        transactions
            .filter(t => t.type === 'expense')
            .map(t => t.category)
    )];

    // Date range presets
    const datePresets = [
        {
            label: 'This Month', getValue: () => {
                const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const end = new Date();
                return { start, end };
            }
        },
        {
            label: 'Last Month', getValue: () => {
                const start = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
                const end = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
                return { start, end };
            }
        },
        {
            label: 'Last 3 Months', getValue: () => {
                const start = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1);
                const end = new Date();
                return { start, end };
            }
        },
        {
            label: 'Last 6 Months', getValue: () => {
                const start = new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1);
                const end = new Date();
                return { start, end };
            }
        },
        {
            label: 'This Year', getValue: () => {
                const start = new Date(new Date().getFullYear(), 0, 1);
                const end = new Date();
                return { start, end };
            }
        },
        {
            label: 'All Time', getValue: () => {
                const start = new Date(2020, 0, 1);
                const end = new Date();
                return { start, end };
            }
        }
    ];

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchQuery(localSearch);
    };

    const clearSearch = () => {
        setLocalSearch('');
        setSearchQuery('');
    };

    const clearAllFilters = () => {
        setSelectedCategory('all');
        setSearchQuery('');
        setLocalSearch('');
        const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = new Date();
        setSelectedDateRange({ start, end });
        setTempDateRange({ start, end });
    };

    const applyDateRange = () => {
        setSelectedDateRange(tempDateRange);
        setShowDatePicker(false);
    };

    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
            {/* Filter Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <FiFilter className="w-4 h-4 text-gray-500" />
                    <h3 className="font-semibold text-gray-800">Filters</h3>
                    {activeFiltersCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                            {activeFiltersCount} active
                        </span>
                    )}
                </div>
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                        <FiX className="w-3 h-3" /> Clear all
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search
                    </label>
                    <form onSubmit={handleSearchSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            placeholder="Search by description or category..."
                            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {localSearch && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="px-3 py-2 text-gray-500 hover:text-gray-700"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Search
                        </button>
                    </form>
                    {searchQuery && (
                        <p className="text-xs text-gray-500 mt-1">
                            Showing results for: "{searchQuery}"
                        </p>
                    )}
                </div>

                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            {expenseCategories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat === 'all' ? 'All Categories' : cat}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Date Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                    </label>
                    <div className="relative">
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between bg-white hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-2">
                                <FiCalendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">
                                    {selectedDateRange.start.toLocaleDateString()} - {selectedDateRange.end.toLocaleDateString()}
                                </span>
                            </div>
                            <FiChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {showDatePicker && (
                            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg border z-20 p-4">
                                <div className="space-y-3">
                                    {/* Preset buttons */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {datePresets.map(preset => (
                                            <button
                                                key={preset.label}
                                                onClick={() => {
                                                    const range = preset.getValue();
                                                    setTempDateRange(range);
                                                    setSelectedDateRange(range);
                                                    setShowDatePicker(false);
                                                }}
                                                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="border-t pt-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={formatDateForInput(tempDateRange.start)}
                                                    onChange={(e) => setTempDateRange({
                                                        ...tempDateRange,
                                                        start: new Date(e.target.value)
                                                    })}
                                                    className="w-full px-2 py-1 text-sm border rounded"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                                                <input
                                                    type="date"
                                                    value={formatDateForInput(tempDateRange.end)}
                                                    onChange={(e) => setTempDateRange({
                                                        ...tempDateRange,
                                                        end: new Date(e.target.value)
                                                    })}
                                                    className="w-full px-2 py-1 text-sm border rounded"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => setShowDatePicker(false)}
                                            className="flex-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={applyDateRange}
                                            className="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {selectedCategory !== 'all' && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                            <span>Category: {selectedCategory}</span>
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className="ml-1 hover:text-blue-900"
                            >
                                <FiX className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {searchQuery && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                            <span>Search: {searchQuery}</span>
                            <button
                                onClick={clearSearch}
                                className="ml-1 hover:text-blue-900"
                            >
                                <FiX className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {(() => {
                        const isDefaultDateRange =
                            selectedDateRange.start.getDate() === 1 &&
                            selectedDateRange.start.getMonth() === new Date().getMonth() &&
                            selectedDateRange.end.toDateString() === new Date().toDateString();

                        if (!isDefaultDateRange) {
                            return (
                                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                                    <span>
                                        Date: {selectedDateRange.start.toLocaleDateString()} - {selectedDateRange.end.toLocaleDateString()}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                                            const end = new Date();
                                            setSelectedDateRange({ start, end });
                                        }}
                                        className="ml-1 hover:text-blue-900"
                                    >
                                        <FiX className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            )}

            {/* Filter Stats */}
            <div className="text-xs text-gray-500 pt-2 border-t">
                {(() => {
                    const filteredExpenses = transactions.filter(t => {
                        if (t.type !== 'expense') return false;

                        // Date filter
                        const transactionDate = new Date(t.date);
                        const isWithinDateRange = transactionDate >= selectedDateRange.start &&
                            transactionDate <= selectedDateRange.end;

                        // Category filter
                        const matchesCategory = selectedCategory === 'all' ||
                            t.category === selectedCategory;

                        // Search filter
                        const matchesSearch = searchQuery === '' ||
                            t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());

                        return isWithinDateRange && matchesCategory && matchesSearch;
                    });

                    const totalAmount = filteredExpenses.reduce((sum, t) => sum + t.amount, 0);

                    return (
                        <div className="flex justify-between items-center">
                            <span>
                                Found {filteredExpenses.length} expense(s) matching your filters
                            </span>
                            <span className="font-medium">
                                Total: ${totalAmount.toFixed(2)}
                            </span>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}