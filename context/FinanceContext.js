"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const FinanceContext = createContext();

// Helper functions for calculations
const calculateBalance = (transactions) => {
    return transactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
            return acc + parseFloat(transaction.amount);
        } else {
            return acc - parseFloat(transaction.amount);
        }
    }, 0);
};

const calculateTotalIncome = (transactions) => {
    return transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);
};

const calculateTotalExpense = (transactions) => {
    return transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);
};

const getTransactionsByCategory = (transactions, type) => {
    const filtered = transactions.filter(t => t.type === type);
    const categoryMap = {};

    filtered.forEach(transaction => {
        if (!categoryMap[transaction.category]) {
            categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += parseFloat(transaction.amount);
    });

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
};

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export function FinanceProvider({ children }) {
    // Core data states - Store ALL data from API
    const [allTransactions, setAllTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState({
        income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
        expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Education', 'Other']
    });

    // Auth state
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // UI states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states - These are for DISPLAY only, NOT for API calls
    const [selectedDateRange, setSelectedDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        end: new Date()
    });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Derived data states - These use filtered transactions for dashboard display
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [expenseByCategory, setExpenseByCategory] = useState([]);
    const [incomeByCategory, setIncomeByCategory] = useState([]);

    // Monthly trends - This should use ALL transactions, not filtered
    const [monthlyTrends, setMonthlyTrends] = useState([]);

    // Axios instance with auth
    const api = axios.create({
        baseURL: API_BASE_URL,
    });

    // Add token to requests
    api.interceptors.request.use((config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    // API Functions - Fetch ALL transactions WITHOUT date filters
    const fetchAllTransactions = async () => {
        try {
            setError(null);
            // Don't send date filters - get ALL transactions
            const params = {};

            // Only send category filter if needed (optional)
            if (selectedCategory !== 'all') {
                params.category = selectedCategory;
            }

            const response = await api.get('/transactions', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error.response?.data?.error || 'Failed to fetch transactions');
            throw error;
        }
    };

    const fetchBudgets = async () => {
        try {
            const response = await api.get('/budgets');
            // Ensure budget amounts are numbers
            return response.data.map(budget => ({
                ...budget,
                amount: parseFloat(budget.amount) || 0
            }));
        } catch (error) {
            console.error('Error fetching budgets:', error);
            return [];
        }
    };

    // Filter transactions for display (client-side filtering)
    const getFilteredTransactionsForDisplay = useCallback(() => {
        return allTransactions.filter(transaction => {
            // Parse the UTC ISO string from API
            const transactionDate = new Date(transaction.transaction_date);

            // Create UTC dates for start and end (at beginning of day UTC)
            const startUTC = new Date(Date.UTC(
                selectedDateRange.start.getFullYear(),
                selectedDateRange.start.getMonth(),
                selectedDateRange.start.getDate(),
                0, 0, 0, 0
            ));

            const endUTC = new Date(Date.UTC(
                selectedDateRange.end.getFullYear(),
                selectedDateRange.end.getMonth(),
                selectedDateRange.end.getDate(),
                23, 59, 59, 999
            ));

            const isWithinDateRange = transactionDate >= startUTC && transactionDate <= endUTC;

            const matchesCategory = selectedCategory === 'all' ||
                transaction.category === selectedCategory;

            const matchesSearch = searchQuery === '' ||
                (transaction.description && transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

            return isWithinDateRange && matchesCategory && matchesSearch;
        });
    }, [allTransactions, selectedDateRange, selectedCategory, searchQuery]);

    // Load initial data from API (get ALL transactions)
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        } else {
            setLoading(false);
        }
    }, []);

    // Load data when token changes (but NOT when filters change)
    useEffect(() => {
        if (token) {
            loadAllData();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadAllData = async () => {
        setLoading(true);
        try {
            // Load ALL transactions and budgets
            const [transactionsData, budgetsData] = await Promise.all([
                fetchAllTransactions(),
                fetchBudgets()
            ]);
            if (transactionsData) setAllTransactions(transactionsData);
            if (budgetsData) setBudgets(budgetsData);
        } catch (error) {
            console.error('Error loading data:', error);
            setError('Failed to load data. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    // Update dashboard derived data whenever filters or allTransactions change
    useEffect(() => {
        const filteredTransactions = getFilteredTransactionsForDisplay();
        setTotalBalance(calculateBalance(filteredTransactions));
        setTotalIncome(calculateTotalIncome(filteredTransactions));
        setTotalExpense(calculateTotalExpense(filteredTransactions));
        setExpenseByCategory(getTransactionsByCategory(filteredTransactions, 'expense'));
        setIncomeByCategory(getTransactionsByCategory(filteredTransactions, 'income'));
    }, [allTransactions, selectedDateRange, selectedCategory, searchQuery, getFilteredTransactionsForDisplay]);

    // Update monthly trends using ALL transactions (not filtered)
    const updateMonthlyTrends = useCallback(() => {
        if (!allTransactions.length) {
            setMonthlyTrends([]);
            return;
        }

        const monthlyData = {};

        // Find the earliest and latest transaction dates
        const dates = allTransactions.map(t => new Date(t.transaction_date));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

        // Generate all months between min and max date
        const startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = {
                income: 0,
                expense: 0,
                month: monthKey
            };
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        // Fill in actual transaction data from ALL transactions
        allTransactions.forEach(transaction => {
            const date = new Date(transaction.transaction_date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (monthlyData[monthKey]) {
                if (transaction.type === 'income') {
                    monthlyData[monthKey].income += parseFloat(transaction.amount);
                } else if (transaction.type === 'expense') {
                    monthlyData[monthKey].expense += parseFloat(transaction.amount);
                }
            }
        });

        const trends = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
        setMonthlyTrends(trends);
    }, [allTransactions]);

    // Update monthly trends when allTransactions changes
    useEffect(() => {
        updateMonthlyTrends();
    }, [allTransactions, updateMonthlyTrends]);

    // Get budget progress for a category
    const getBudgetProgress = useCallback((category, month = null) => {
        const targetMonth = month || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

        const budget = budgets.find(b =>
            b.category === category &&
            (b.month === targetMonth || (!b.month && month === null))
        );

        if (!budget) return null;

        // Calculate spent amount from ALL transactions
        const monthTransactions = allTransactions.filter(t => {
            if (t.type !== 'expense') return false;
            const transactionDate = new Date(t.transaction_date);
            const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
            return t.category === category && transactionMonth === targetMonth;
        });

        const spent = monthTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const budgetAmount = parseFloat(budget.amount) || 0;
        const percentage = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
        const remaining = budgetAmount - spent;
        const isOverBudget = spent > budgetAmount;

        let status = 'on-track';
        let statusMessage = 'On Track';

        if (isOverBudget) {
            status = 'over-budget';
            statusMessage = 'Over Budget';
        } else if (percentage >= 90) {
            status = 'warning';
            statusMessage = 'Near Limit';
        } else if (percentage >= 75) {
            status = 'caution';
            statusMessage = 'Caution';
        }

        return {
            ...budget,
            amount: budgetAmount,
            spent,
            percentage: Math.min(percentage, 100),
            remaining: Math.max(remaining, 0),
            isOverBudget,
            status,
            statusMessage,
            progressWidth: Math.min(percentage, 100)
        };
    }, [budgets, allTransactions]);

    const getBalanceTrendData = useCallback((startDate, endDate, interval = 'day') => {
        if (!allTransactions || !allTransactions.length) return [];

        const startUTC = new Date(Date.UTC(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            0, 0, 0, 0
        ));

        const endUTC = new Date(Date.UTC(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            23, 59, 59, 999
        ));

        const filteredTransactions = allTransactions.filter(t => {
            const tDate = new Date(t.transaction_date);
            return tDate >= startUTC && tDate <= endUTC;
        });

        const sortedTransactions = [...filteredTransactions].sort(
            (a, b) => new Date(a.transaction_date) - new Date(b.transaction_date)
        );

        // For minute-based precision (Today view)
        if (interval === 'hour') {
            const dataPoints = [];
            let runningBalance = 0;

            const startOfDay = new Date(startUTC);

            // Add starting point
            dataPoints.push({
                time: format(startOfDay, 'HH:mm'),
                displayLabel: format(startOfDay, 'HH:mm'),
                balance: 0,
                transactions: [],
                income: 0,
                expense: 0,
                isInitial: true,
                hour: startOfDay.getHours(),
                minute: startOfDay.getMinutes()
            });

            // Create a point for EACH transaction at its exact minute
            sortedTransactions.forEach((transaction) => {
                const tUTC = new Date(transaction.transaction_date);
                const amount = parseFloat(transaction.amount);

                runningBalance += transaction.type === 'income' ? amount : -amount;
                const timeStr = format(tUTC, 'HH:mm');

                dataPoints.push({
                    time: timeStr,
                    displayLabel: timeStr,
                    balance: runningBalance,
                    transactions: [transaction],
                    income: transaction.type === 'income' ? amount : 0,
                    expense: transaction.type === 'expense' ? amount : 0,
                    hour: tUTC.getHours(),
                    minute: tUTC.getMinutes(),
                    exactTime: tUTC
                });
            });

            return dataPoints;
        }
        else {
            // For day ranges - group by date
            const startUTCDate = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
            const endUTCDate = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59));

            const groupedData = new Map();
            let currentDate = new Date(startUTCDate);

            while (currentDate <= endUTCDate) {
                const dateKey = currentDate.toISOString().split('T')[0];
                groupedData.set(dateKey, {
                    date: dateKey,
                    displayLabel: format(currentDate, 'MMM dd'), // Unified field
                    displayDate: format(currentDate, 'MMM dd'),
                    balance: 0,
                    transactions: [],
                    income: 0,
                    expense: 0,
                    time: null
                });
                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            }

            let runningBalance = 0;
            sortedTransactions.forEach(t => {
                const tUTC = new Date(t.transaction_date);
                const dateKey = tUTC.toISOString().split('T')[0];
                const amount = parseFloat(t.amount);
                runningBalance += t.type === 'income' ? amount : -amount;

                if (groupedData.has(dateKey)) {
                    const data = groupedData.get(dateKey);
                    data.balance = runningBalance;
                    data.transactions.push(t);
                    if (t.type === 'income') {
                        data.income = (data.income || 0) + amount;
                    } else {
                        data.expense = (data.expense || 0) + amount;
                    }
                }
            });

            let lastBalance = 0;
            const sortedDates = Array.from(groupedData.keys()).sort();
            for (const dateKey of sortedDates) {
                const data = groupedData.get(dateKey);
                if (data.transactions.length === 0) {
                    data.balance = lastBalance;
                } else {
                    lastBalance = data.balance;
                }
            }

            return Array.from(groupedData.values());
        }
    }, [allTransactions]);

    // Auth Operations
    const login = useCallback(async (email, password) => {
        try {
            setError(null);
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password
            });

            const { token, user } = response.data;
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return true;
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.error || 'Login failed');
            return false;
        }
    }, []);

    const register = useCallback(async (name, email, password, currency = 'USD') => {
        try {
            setError(null);
            await axios.post(`${API_BASE_URL}/auth/register`, {
                name,
                email,
                password,
                currency
            });
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.error || 'Registration failed');
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setAllTransactions([]);
        setBudgets([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    // FIXED: Transaction CRUD Operations with proper UTC handling
    const addTransaction = useCallback(async (transaction) => {
        try {
            setError(null);

            let utcDateTime;

            if (transaction.date) {
                // Parse the selected date (YYYY-MM-DD from date picker)
                const [year, month, day] = transaction.date.split('T')[0].split('-');

                // Get current LOCAL time
                const now = new Date();

                // Create a Date object using LOCAL date and time
                // Month is 0-indexed in JavaScript Date constructor
                const localDateTime = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day),
                    now.getHours(),
                    now.getMinutes(),
                    now.getSeconds(),
                    now.getMilliseconds()
                );

                // Convert to UTC ISO string
                utcDateTime = localDateTime.toISOString();

                console.log('Creating transaction:', {
                    selectedDate: transaction.date,
                    localDateTime: localDateTime.toString(),
                    utcDateTime: utcDateTime
                });
            } else {
                // Use current UTC time
                utcDateTime = new Date().toISOString();
            }

            const formattedTransaction = {
                amount: transaction.amount,
                category: transaction.category,
                type: transaction.type,
                description: transaction.description || '',
                transaction_date: utcDateTime // Send UTC ISO string
            };

            const response = await api.post('/transactions', formattedTransaction);
            setAllTransactions(prev => [response.data, ...prev]);
            return response.data;
        } catch (error) {
            console.error('Error adding transaction:', error);
            setError(error.response?.data?.error || 'Failed to add transaction');
            throw error;
        }
    }, [api]);

    const updateTransaction = useCallback(async (id, updatedData) => {
        try {
            setError(null);
            const formattedData = {};

            if (updatedData.amount !== undefined) formattedData.amount = updatedData.amount;
            if (updatedData.category !== undefined) formattedData.category = updatedData.category;
            if (updatedData.type !== undefined) formattedData.type = updatedData.type;
            if (updatedData.description !== undefined) formattedData.description = updatedData.description;

            if (updatedData.date !== undefined) {
                // Convert to UTC ISO string if date is being updated
                const [year, month, day] = updatedData.date.split('T')[0].split('-');
                const now = new Date();
                const localDateTime = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    parseInt(day),
                    now.getHours(),
                    now.getMinutes(),
                    now.getSeconds(),
                    now.getMilliseconds()
                );
                formattedData.transaction_date = localDateTime.toISOString();
            }

            const response = await api.put(`/transactions/${id}`, formattedData);
            setAllTransactions(prev => prev.map(transaction =>
                transaction.transaction_id === parseInt(id) ? response.data : transaction
            ));
            return response.data;
        } catch (error) {
            console.error('Error updating transaction:', error);
            setError(error.response?.data?.error || 'Failed to update transaction');
            throw error;
        }
    }, [api]);

    const deleteTransaction = useCallback(async (id) => {
        try {
            setError(null);
            await api.delete(`/transactions/${id}`);
            setAllTransactions(prev => prev.filter(transaction => transaction.transaction_id !== parseInt(id)));
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setError(error.response?.data?.error || 'Failed to delete transaction');
            throw error;
        }
    }, [api]);

    // CRUD Operations for Budgets
    const addBudget = useCallback(async (budget) => {
        try {
            setError(null);
            const response = await api.post('/budgets', budget);
            setBudgets(prev => [...prev, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error adding budget:', error);
            setError(error.response?.data?.error || 'Failed to add budget');
            throw error;
        }
    }, [api]);

    const updateBudget = useCallback(async (id, updatedData) => {
        try {
            setError(null);
            const response = await api.put(`/budgets/${id}`, updatedData);

            // Convert both to numbers or both to strings for comparison
            const numericId = typeof id === 'string' ? parseInt(id) : id;

            setBudgets(prev => prev.map(budget => {
                const budgetId = budget.budget_id || budget.id;
                const numericBudgetId = typeof budgetId === 'string' ? parseInt(budgetId) : budgetId;

                if (numericBudgetId === numericId) {
                    return { ...budget, ...response.data };
                }
                return budget;
            }));

            return response.data;
        } catch (error) {
            console.error('Error updating budget:', error);
            setError(error.response?.data?.error || 'Failed to update budget');
            throw error;
        }
    }, [api]);

    const deleteBudget = useCallback(async (id) => {
        try {
            setError(null);
            await api.delete(`/budgets/${id}`);
            setBudgets(prev => prev.filter(budget => budget.budget_id !== id));
        } catch (error) {
            console.error('Error deleting budget:', error);
            setError(error.response?.data?.error || 'Failed to delete budget');
            throw error;
        }
    }, [api]);

    // Get summary data
    const getSummary = useCallback(async (startDate, endDate) => {
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const response = await api.get('/analytics/summary', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching summary:', error);
            setError(error.response?.data?.error || 'Failed to fetch summary');
            throw error;
        }
    }, [api]);

    // Get trends data
    const getTrends = useCallback(async (year) => {
        try {
            const params = year ? { year } : {};
            const response = await api.get('/analytics/trends', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching trends:', error);
            setError(error.response?.data?.error || 'Failed to fetch trends');
            throw error;
        }
    }, [api]);

    // Export data
    const exportData = useCallback(async () => {
        try {
            const data = {
                transactions: allTransactions,
                budgets: budgets,
                user: user,
                exportDate: new Date().toISOString()
            };

            const dataStr = JSON.stringify(data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = `finance_data_${new Date().toISOString()}.json`;

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        } catch (error) {
            console.error('Error exporting data:', error);
            setError('Failed to export data');
        }
    }, [allTransactions, budgets, user]);

    // Refresh data
    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const [transactionsData, budgetsData] = await Promise.all([
                fetchAllTransactions(),
                fetchBudgets()
            ]);
            if (transactionsData) setAllTransactions(transactionsData);
            if (budgetsData) setBudgets(budgetsData);
        } catch (error) {
            console.error('Error refreshing data:', error);
            setError('Failed to refresh data');
        } finally {
            setLoading(false);
        }
    }, [fetchAllTransactions, fetchBudgets]);

    const value = {
        // State
        transactions: allTransactions,
        allTransactions,
        budgets,
        categories,
        user,
        loading,
        error,
        selectedDateRange,
        selectedCategory,
        searchQuery,
        totalBalance,
        totalIncome,
        totalExpense,
        expenseByCategory,
        incomeByCategory,
        monthlyTrends,
        isAuthenticated: !!token,

        // Auth Actions
        login,
        register,
        logout,

        // Transaction Actions
        addTransaction,
        updateTransaction,
        deleteTransaction,

        // Budget Actions
        addBudget,
        updateBudget,
        deleteBudget,
        getBudgetProgress,

        // Analytics
        getSummary,
        getTrends,
        getBalanceTrendData,

        // Filters
        setSelectedDateRange,
        setSelectedCategory,
        setSearchQuery,

        // Helper
        getFilteredTransactionsForDisplay,
        refreshData,
        exportData,
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}