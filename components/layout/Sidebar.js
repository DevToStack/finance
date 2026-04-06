"use client";

import {
    FiHome,
    FiPieChart,
    FiTrendingUp,
    FiTarget,
    FiSettings,
    FiLogOut,
    FiX,
    FiCreditCard,
    FiBarChart2,
    FiUser,
    FiBell,
    FiHelpCircle,
    FiChevronRight,
    FiMail,
    FiDollarSign,
    FiShield
} from "react-icons/fi";
import { useSidebar } from "@/context/useSidebar";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency } from "@/utils/formatters";

export default function Sidebar() {
    const { isOpen, toggleSidebar, closeSidebar, activeTab, setActiveTab } = useSidebar();
    const pathname = usePathname();
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState(null);
    const { totalIncome, totalExpense, transactions, user, logout, isAuthenticated } = useFinance();
    const [isDark, setIsDark] = useState(false);
    const [userName, setUserName] = useState('John Doe');
    const [userEmail, setUserEmail] = useState('john.doe@example.com');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Theme detection
    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    // Set user name from context
    useEffect(() => {
        if (user && user.name) {
            setUserName(user.name);
            setUserEmail(user.email || 'user@example.com');
        } else if (isAuthenticated && !user) {
            // Try to get from localStorage
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUserName(parsedUser.name || 'User');
                    setUserEmail(parsedUser.email || 'user@example.com');
                } catch (e) {
                    console.error('Error parsing user:', e);
                }
            }
        }
    }, [user, isAuthenticated]);

    // Close sidebar on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024 && isOpen) {
                closeSidebar();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, closeSidebar]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update active tab based on pathname
    useEffect(() => {
        if (pathname === '/dashboard') setActiveTab('overview');
        else if (pathname === '/dashboard/expenses') setActiveTab('expense');
        else if (pathname === '/dashboard/income') setActiveTab('income');
        else if (pathname === '/dashboard/budget') setActiveTab('budget');
        else if (pathname === '/dashboard/settings') setActiveTab('settings');
    }, [pathname, setActiveTab]);

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: FiHome, href: '/dashboard' },
        { id: 'expense', label: 'Expenses', icon: FiTrendingUp, href: '/dashboard/expenses' },
        { id: 'income', label: 'Income', icon: FiPieChart, href: '/dashboard/income' },
        { id: 'budget', label: 'Budget', icon: FiTarget, href: '/dashboard/budget' },
        { id: 'settings', label: 'Settings', icon: FiSettings, href: '/dashboard/settings' },
    ];

    const handleTabChange = (tabId, href) => {
        setActiveTab(tabId);
        router.push(href);
        if (window.innerWidth < 1024) {
            closeSidebar();
        }
    };

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await logout();
        router.push('/login');
    };

    const handleProfileSettings = () => {
        setIsDropdownOpen(false);
        router.push('/dashboard/profile');
    };

    const handleAccountSettings = () => {
        setIsDropdownOpen(false);
        router.push('/dashboard/account');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Calculate income and expense percentages for progress bars
    const getIncomePercentage = () => {
        if (totalIncome === 0) return 0;
        const maxExpectedIncome = 10000;
        return Math.min((totalIncome / maxExpectedIncome) * 100, 100);
    };

    const getExpensePercentage = () => {
        if (totalExpense === 0) return 0;
        const maxExpectedExpense = 8000;
        return Math.min((totalExpense / maxExpectedExpense) * 100, 100);
    };

    // Dynamic classes based on theme
    const sidebarBg = isDark ? 'bg-black' : 'bg-white';
    const borderColor = isDark ? 'border-gray-800' : 'border-gray-100';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const textTertiary = isDark ? 'text-gray-500' : 'text-gray-400';
    const hoverBg = isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-50';
    const activeGradient = isDark
        ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white'
        : 'bg-black text-white';
    const statCardBg = isDark ? 'bg-gray-900/50' : 'bg-gray-50';
    const dropdownBg = isDark ? 'bg-gray-900' : 'bg-white';
    const dropdownBorder = isDark ? 'border-gray-700' : 'border-gray-200';

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className={`fixed inset-0 ${isDark ? 'bg-black/50' : 'bg-black/20'} backdrop-blur-sm z-40 lg:hidden transition-all duration-300`}
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 max-h-screen z-50 
                transform transition-all duration-300 ease-in-out
                lg:relative lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className={`w-72 h-full max-h-screen ${sidebarBg} ${borderColor} border-r flex flex-col`}>
                    {/* Header with App Name and Close Button */}
                    <div className={`p-5 ${borderColor} border-b`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                                        <FiCreditCard className="w-4 h-4 text-white dark:text-gray-900" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className={`text-lg font-semibold ${textPrimary} tracking-tight`}>
                                        Xpenso
                                    </h2>
                                    <p className={`text-xs ${textTertiary}`}>Finance Tracker</p>
                                </div>
                            </div>

                            <button
                                onClick={closeSidebar}
                                className={`p-1.5 rounded-md ${hoverBg} transition-colors lg:hidden ${textSecondary}`}
                                aria-label="Close sidebar"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* User Section with Dropdown */}
                    <div className={`px-3 py-4 ${borderColor} border-b relative`} ref={dropdownRef}>
                        <div
                            className={`flex items-center gap-3 ${hoverBg} rounded-lg p-2 transition-colors cursor-pointer`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full flex items-center justify-center">
                                    <FiUser className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-xs ${textSecondary}`}>{getGreeting()}</p>
                                <p className={`text-sm font-medium ${textPrimary} truncate`}>{userName}</p>
                            </div>
                            <FiChevronRight className={`w-3.5 h-3.5 ${textSecondary} transition-transform duration-200 ${isDropdownOpen ? 'rotate-90' : ''}`} />
                        </div>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className={`absolute left-3 right-3 top-[calc(100%-8px)] z-50 ${dropdownBg} ${dropdownBorder} border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200`}>
                                {/* User Details */}
                                <div className={`p-4 ${borderColor} border-b`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full flex items-center justify-center">
                                            <FiUser className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-semibold ${textPrimary}`}>{userName}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <FiMail className="w-3 h-3 ${textTertiary}" />
                                                <p className={`text-xs ${textTertiary} truncate`}>{userEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button
                                        onClick={handleProfileSettings}
                                        className={`w-full px-4 py-2.5 flex items-center gap-3 ${hoverBg} transition-colors group`}
                                    >
                                        <FiUser className="w-4 h-4 ${textSecondary} group-hover:scale-105 transition-transform" />
                                        <span className={`text-sm ${textPrimary} flex-1 text-left`}>Profile Settings</span>
                                        <FiChevronRight className={`w-3 h-3 ${textTertiary} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    </button>

                                    <button
                                        onClick={handleAccountSettings}
                                        className={`w-full px-4 py-2.5 flex items-center gap-3 ${hoverBg} transition-colors group`}
                                    >
                                        <FiShield className="w-4 h-4 ${textSecondary} group-hover:scale-105 transition-transform" />
                                        <span className={`text-sm ${textPrimary} flex-1 text-left`}>Account Settings</span>
                                        <FiChevronRight className={`w-3 h-3 ${textTertiary} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    </button>

                                    <div className={`my-2 ${borderColor} border-t`} />

                                    <button
                                        onClick={handleLogout}
                                        className={`w-full px-4 py-2.5 flex items-center gap-3 ${hoverBg} transition-colors group text-red-600 dark:text-red-400`}
                                    >
                                        <FiLogOut className="w-4 h-4 group-hover:scale-105 transition-transform" />
                                        <span className="text-sm font-medium flex-1 text-left">Log out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-hide">
                        <div className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTabChange(item.id, item.href)}
                                        onMouseEnter={() => setHoveredItem(item.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        className={`
                                            w-full py-2 px-3 rounded-lg flex items-center gap-3 
                                            transition-all duration-200 group relative
                                            ${isActive
                                                ? activeGradient
                                                : `${textSecondary} ${hoverBg}`
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-current' : ''}`} />
                                        <span className="text-sm font-medium">{item.label}</span>

                                        {isActive && (
                                            <div className="ml-auto w-1 h-1 bg-current rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Stats - Using Real Data */}
                        <div className={`mt-6 pt-6 ${borderColor} border-t`}>
                            <p className={`text-xs font-medium ${textTertiary} px-3 mb-3 uppercase tracking-wider`}>
                                Quick stats
                            </p>
                            <div className="space-y-2">
                                <div className={`${statCardBg} rounded-lg p-3 transition-colors`}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={`text-xs font-medium ${textSecondary}`}>Total Income</span>
                                        <FiTrendingUp className="w-3 h-3 text-emerald-500" />
                                    </div>
                                    <p className={`text-base font-semibold ${textPrimary}`}>
                                        {formatCurrency(totalIncome)}
                                    </p>
                                    <div className="mt-2 h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${getIncomePercentage()}%` }}
                                        />
                                    </div>
                                </div>

                                <div className={`${statCardBg} rounded-lg p-3 transition-colors`}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={`text-xs font-medium ${textSecondary}`}>Total Expenses</span>
                                        <FiBarChart2 className="w-3 h-3 text-rose-500" />
                                    </div>
                                    <p className={`text-base font-semibold ${textPrimary}`}>
                                        {formatCurrency(totalExpense)}
                                    </p>
                                    <div className="mt-2 h-1 bg-rose-500/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                                            style={{ width: `${getExpensePercentage()}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Net Balance */}
                                <div className={`${statCardBg} rounded-lg p-3 transition-colors`}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={`text-xs font-medium ${textSecondary}`}>Net Balance</span>
                                        <FiCreditCard className="w-3 h-3 text-blue-500" />
                                    </div>
                                    <p className={`text-base font-semibold ${totalIncome - totalExpense >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {formatCurrency(totalIncome - totalExpense)}
                                    </p>
                                    <div className="mt-2 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(Math.abs((totalIncome - totalExpense) / (totalIncome || 1) * 100), 100)}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Transaction Count */}
                                <div className={`${statCardBg} rounded-lg p-3 transition-colors`}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className={`text-xs font-medium ${textSecondary}`}>Transactions</span>
                                        <FiPieChart className="w-3 h-3 text-purple-500" />
                                    </div>
                                    <p className={`text-base font-semibold ${textPrimary}`}>
                                        {transactions.length}
                                    </p>
                                    <div className="mt-2 h-1 bg-purple-500/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((transactions.length / 100) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Footer Actions */}
                    <div className={`${borderColor} border-t`}>
                        <div className={`flex items-center justify-between px-3 py-2 ${borderColor} border-b`}>
                            <button className={`p-2 rounded-md ${hoverBg} ${textSecondary} transition-colors`}>
                                <FiBell className="w-4 h-4" />
                            </button>
                            <button className={`p-2 rounded-md ${hoverBg} ${textSecondary} transition-colors`}>
                                <FiHelpCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}