// lib/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Generate realistic mock data for the past 6 months
const generateMockTransactions = () => {
    const categories = {
        income: ['Salary', 'Freelance', 'Investments', 'Bonus', 'Refund'],
        expense: ['Food', 'Rent', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Health', 'Education']
    };

    const descriptions = {
        'Salary': ['Monthly Salary', 'Bi-weekly Paycheck'],
        'Freelance': ['Web Development Project', 'Design Contract', 'Consulting Fee'],
        'Investments': ['Dividend Payment', 'Stock Sale', 'Crypto Gains'],
        'Food': ['Grocery Store', 'Restaurant', 'Coffee Shop', 'Food Delivery'],
        'Rent': ['Monthly Rent', 'Parking Fee'],
        'Transport': ['Uber Ride', 'Gas Station', 'Public Transit', 'Car Maintenance'],
        'Utilities': ['Electric Bill', 'Internet', 'Phone Bill', 'Water Bill'],
        'Shopping': ['Amazon Purchase', 'Clothing Store', 'Electronics', 'Home Goods'],
        'Entertainment': ['Netflix', 'Spotify', 'Movie Tickets', 'Concert'],
        'Health': ['Pharmacy', 'Doctor Visit', 'Gym Membership'],
        'Education': ['Online Course', 'Books', 'Workshop']
    };

    const transactions = [];
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    // Generate transactions for the past 6 months
    for (let d = new Date(sixMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        const numTransactions = isWeekend ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < numTransactions; i++) {
            const isIncome = Math.random() < 0.15;
            const type = isIncome ? 'income' : 'expense';
            const categoryList = categories[type];
            const category = categoryList[Math.floor(Math.random() * categoryList.length)];
            const descList = descriptions[category] || ['Transaction'];
            const description = descList[Math.floor(Math.random() * descList.length)];
            
            let amount;
            if (type === 'income') {
                amount = category === 'Salary' ? 4500 + Math.random() * 1000 :
                        category === 'Freelance' ? 500 + Math.random() * 1500 :
                        category === 'Investments' ? 100 + Math.random() * 500 :
                        50 + Math.random() * 200;
            } else {
                amount = category === 'Rent' ? 1500 + Math.random() * 200 :
                        category === 'Utilities' ? 50 + Math.random() * 150 :
                        category === 'Food' ? 15 + Math.random() * 80 :
                        category === 'Transport' ? 10 + Math.random() * 50 :
                        category === 'Shopping' ? 30 + Math.random() * 200 :
                        category === 'Entertainment' ? 10 + Math.random() * 60 :
                        20 + Math.random() * 100;
            }

            transactions.push({
                id: `tx-${Date.now()}-${i}-${d.getTime()}`,
                date: dateStr,
                amount: Math.round(amount * 100) / 100,
                category,
                type,
                description,
                status: Math.random() > 0.1 ? 'completed' : 'pending'
            });
        }
    }

    // Add salary on specific dates
    const salaryDates = [];
    for (let i = 0; i < 6; i++) {
        const salaryDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        if (salaryDate >= sixMonthsAgo) {
            salaryDates.push(salaryDate.toISOString().split('T')[0]);
        }
    }

    salaryDates.forEach((date, idx) => {
        transactions.push({
            id: `salary-${idx}`,
            date,
            amount: 5200,
            category: 'Salary',
            type: 'income',
            description: 'Monthly Salary',
            status: 'completed'
        });
    });

    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Budget configuration
const defaultBudgets = [
    { category: 'Food', limit: 800, color: '#ef4444' },
    { category: 'Rent', limit: 1800, color: '#3b82f6' },
    { category: 'Transport', limit: 400, color: '#f59e0b' },
    { category: 'Utilities', limit: 300, color: '#10b981' },
    { category: 'Shopping', limit: 500, color: '#8b5cf6' },
    { category: 'Entertainment', limit: 200, color: '#ec4899' },
    { category: 'Health', limit: 150, color: '#06b6d4' },
    { category: 'Education', limit: 100, color: '#84cc16' }
];

// Notifications
const generateInitialNotifications = () => [
    {
        id: 'notif-1',
        type: 'warning',
        title: 'Budget Alert',
        message: 'You\'ve spent 85% of your Food budget this month',
        time: '2 hours ago',
        read: false
    },
    {
        id: 'notif-2',
        type: 'success',
        title: 'Payment Received',
        message: 'Your salary of $5,200 has been deposited',
        time: '1 day ago',
        read: false
    },
    {
        id: 'notif-3',
        type: 'info',
        title: 'New Feature',
        message: 'Export your transactions to CSV or PDF',
        time: '3 days ago',
        read: true
    }
];

const initialTransactions = [
    { id: '1', date: '2024-03-01', amount: 2500, category: 'Salary', type: 'income', description: 'Monthly salary' },
    { id: '2', date: '2024-03-05', amount: 120, category: 'Groceries', type: 'expense', description: 'Supermarket' },
    { id: '3', date: '2024-03-10', amount: 45, category: 'Dining', type: 'expense', description: 'Restaurant' },
    { id: '4', date: '2024-03-12', amount: 15, category: 'Entertainment', type: 'expense', description: 'Netflix' },
    { id: '5', date: '2024-03-15', amount: 200, category: 'Shopping', type: 'expense', description: 'Clothes' },
    { id: '6', date: '2024-03-18', amount: 60, category: 'Utilities', type: 'expense', description: 'Electricity bill' },
    { id: '7', date: '2024-03-20', amount: 500, category: 'Freelance', type: 'income', description: 'Project payment' },
    { id: '8', date: '2024-03-22', amount: 80, category: 'Groceries', type: 'expense', description: 'Weekly shopping' },
    { id: '9', date: '2024-03-25', amount: 30, category: 'Entertainment', type: 'expense', description: 'Movie tickets' },
    { id: '10', date: '2024-03-28', amount: 100, category: 'Transport', type: 'expense', description: 'Gas' },
];

const useStore = create(
    persist(
        (set, get) => ({
            // Data
            transactions: generateMockTransactions(),
            budgets: defaultBudgets,
            notifications: generateInitialNotifications(),
            
            // User settings
            role: 'admin',
            user: {
                name: 'Alex Johnson',
                email: 'alex@example.com',
                avatar: null
            },
            
            // Filters
            searchTerm: '',
            typeFilter: 'all',
            categoryFilter: 'all',
            dateRange: { start: null, end: null },
            sortBy: 'date-desc',
            
            // UI State
            currentPage: 1,
            itemsPerPage: 10,
            isSidebarCollapsed: false,

            // Actions - Transactions
            addTransaction: (transaction) => {
                const { role } = get();
                if (role !== 'admin') return;
                set((state) => ({
                    transactions: [{ ...transaction, id: `tx-${Date.now()}` }, ...state.transactions],
                }));
                get().addNotification({
                    type: 'success',
                    title: 'Transaction Added',
                    message: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount} added`
                });
            },

            editTransaction: (id, updatedTransaction) => {
                const { role } = get();
                if (role !== 'admin') return;
                set((state) => ({
                    transactions: state.transactions.map((t) =>
                        t.id === id ? { ...t, ...updatedTransaction } : t
                    ),
                }));
            },

            deleteTransaction: (id) => {
                const { role } = get();
                if (role !== 'admin') return;
                set((state) => ({
                    transactions: state.transactions.filter((t) => t.id !== id),
                }));
            },

            // Actions - Budgets
            updateBudget: (category, newLimit) => {
                set((state) => ({
                    budgets: state.budgets.map(b =>
                        b.category === category ? { ...b, limit: newLimit } : b
                    )
                }));
            },

            // Actions - Notifications
            addNotification: (notification) => {
                const newNotif = {
                    id: `notif-${Date.now()}`,
                    ...notification,
                    time: 'Just now',
                    read: false
                };
                set((state) => ({
                    notifications: [newNotif, ...state.notifications]
                }));
            },

            markNotificationRead: (id) => {
                set((state) => ({
                    notifications: state.notifications.map(n =>
                        n.id === id ? { ...n, read: true } : n
                    )
                }));
            },

            markAllNotificationsRead: () => {
                set((state) => ({
                    notifications: state.notifications.map(n => ({ ...n, read: true }))
                }));
            },

            clearNotification: (id) => {
                set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== id)
                }));
            },

            // Actions - Filters & UI
            setRole: (role) => set({ role }),
            setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
            setTypeFilter: (filter) => set({ typeFilter: filter, currentPage: 1 }),
            setCategoryFilter: (filter) => set({ categoryFilter: filter, currentPage: 1 }),
            setDateRange: (range) => set({ dateRange: range, currentPage: 1 }),
            setSortBy: (sort) => set({ sortBy: sort }),
            setCurrentPage: (page) => set({ currentPage: page }),
            setItemsPerPage: (count) => set({ itemsPerPage: count, currentPage: 1 }),
            toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

            resetToMockData: () => {
                const { role } = get();
                if (role !== 'admin') return;
                set({ 
                    transactions: generateMockTransactions(),
                    budgets: defaultBudgets
                });
            },

            // Computed - Get filtered transactions
            getFilteredTransactions: () => {
                const state = get();
                let filtered = [...state.transactions];

                if (state.searchTerm) {
                    const term = state.searchTerm.toLowerCase();
                    filtered = filtered.filter(t =>
                        t.description?.toLowerCase().includes(term) ||
                        t.category.toLowerCase().includes(term)
                    );
                }

                if (state.typeFilter !== 'all') {
                    filtered = filtered.filter(t => t.type === state.typeFilter);
                }

                if (state.categoryFilter !== 'all') {
                    filtered = filtered.filter(t => t.category === state.categoryFilter);
                }

                if (state.dateRange.start && state.dateRange.end) {
                    filtered = filtered.filter(t =>
                        t.date >= state.dateRange.start && t.date <= state.dateRange.end
                    );
                }

                const [sortField, sortOrder] = state.sortBy.split('-');
                filtered.sort((a, b) => {
                    if (sortField === 'date') {
                        return sortOrder === 'desc'
                            ? new Date(b.date) - new Date(a.date)
                            : new Date(a.date) - new Date(b.date);
                    }
                    if (sortField === 'amount') {
                        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
                    }
                    return 0;
                });

                return filtered;
            },

            // Export data
            exportToCSV: () => {
                const transactions = get().getFilteredTransactions();
                const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status'];
                const rows = transactions.map(t => [
                    t.date,
                    t.description || t.category,
                    t.category,
                    t.type,
                    t.amount,
                    t.status
                ]);
                
                const csvContent = [
                    headers.join(','),
                    ...rows.map(r => r.join(','))
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        }),
        {
            name: 'finance-dashboard',
            partialize: (state) => ({
                role: state.role,
                budgets: state.budgets,
                user: state.user
            })
        }
    )
);

export default useStore;