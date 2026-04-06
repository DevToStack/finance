"use client";

import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/formatters';
import { FiBell, FiUser, FiCalendar, FiLogOut, FiSettings } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { totalBalance, user, logout, isAuthenticated } = useFinance();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const router = useRouter();

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

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    // Get user's first name or display name
    const getDisplayName = () => {
        if (!user) return 'User';
        return user.name || user.email?.split('@')[0] || 'User';
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user || !user.name) return 'U';
        return user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Dynamic classes based on theme
    const headerBg = isDark ? 'bg-black' : 'bg-white';
    const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
    const textPrimary = isDark ? 'text-white' : 'text-gray-800';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const textTertiary = isDark ? 'text-gray-500' : 'text-gray-400';
    const balanceColor = isDark ? 'text-green-400' : 'text-green-600';
    const buttonHover = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
    const iconColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const dropdownBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
    const dropdownItemHover = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
    const dropdownText = isDark ? 'text-gray-300' : 'text-gray-700';
    const dropdownBorder = isDark ? 'border-gray-800' : 'border-gray-100';
    const logoutText = isDark ? 'text-red-400' : 'text-red-600';
    const logoutHover = isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50';

    return (
        <header className={`${headerBg} ${borderColor} border-b px-6 py-4 transition-all duration-300`}>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-2xl font-bold ${textPrimary}`}>Dashboard</h1>
                    <p className={`text-sm ${textSecondary} mt-1`}>
                        Welcome back, {getDisplayName()}! Here's your financial overview
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Balance Display */}
                    <div className="hidden md:block text-right">
                        <p className={`text-sm ${textSecondary}`}>Total Balance</p>
                        <p className={`text-xl font-bold ${balanceColor}`}>
                            {formatCurrency(totalBalance)}
                        </p>
                    </div>

                    {/* Date Range Picker */}
                    <button className={`p-2 rounded-lg ${buttonHover} transition-all duration-200`}>
                        <FiCalendar className={`w-5 h-5 ${iconColor}`} />
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowUserMenu(false);
                            }}
                            className={`p-2 rounded-lg ${buttonHover} transition-all duration-200 relative`}
                        >
                            <FiBell className={`w-5 h-5 ${iconColor}`} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
                        </button>

                        {showNotifications && (
                            <div className={`absolute right-0 mt-2 w-80 ${dropdownBg} rounded-lg shadow-lg ${borderColor} border z-50 transition-all duration-200`}>
                                <div className={`p-4 ${dropdownBorder} border-b`}>
                                    <h3 className={`font-semibold ${textPrimary}`}>Notifications</h3>
                                </div>
                                <div className="p-4">
                                    <div className="flex flex-col items-center gap-3 py-4">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                            <FiBell className={`w-6 h-6 ${textTertiary}`} />
                                        </div>
                                        <p className={`text-sm ${textSecondary} text-center`}>
                                            No new notifications
                                        </p>
                                        <p className={`text-xs ${textTertiary} text-center`}>
                                            We'll notify you when something arrives
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowUserMenu(!showUserMenu);
                                setShowNotifications(false);
                            }}
                            className={`flex items-center gap-2 p-1.5 rounded-lg ${buttonHover} transition-all duration-200`}
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                                {getUserInitials()}
                            </div>
                            <span className={`hidden md:inline text-sm font-medium ${textPrimary}`}>
                                {getDisplayName()}
                            </span>
                        </button>

                        {showUserMenu && (
                            <div className={`absolute right-0 mt-2 w-64 ${dropdownBg} rounded-lg shadow-lg ${borderColor} border z-50 transition-all duration-200`}>
                                <div className={`p-4 ${dropdownBorder} border-b`}>
                                    <p className={`font-semibold ${textPrimary}`}>{user?.name || 'User'}</p>
                                    <p className={`text-sm ${textSecondary} mt-1`}>{user?.email}</p>
                                    {user?.currency && (
                                        <p className={`text-xs ${textTertiary} mt-2 flex items-center gap-1`}>
                                            <span>Currency:</span>
                                            <span className="font-medium">{user.currency}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="py-2">
                                    <Link
                                        href="/profile"
                                        className={`flex items-center gap-3 px-4 py-2 text-sm ${dropdownText} ${dropdownItemHover} transition-colors duration-200`}
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <FiUser className="w-4 h-4" />
                                        <span>Profile Settings</span>
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className={`flex items-center gap-3 px-4 py-2 text-sm ${dropdownText} ${dropdownItemHover} transition-colors duration-200`}
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <FiSettings className="w-4 h-4" />
                                        <span>Account Settings</span>
                                    </Link>
                                    <hr className={`my-2 ${dropdownBorder}`} />
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            handleLogout();
                                        }}
                                        className={`flex items-center gap-3 px-4 py-2 text-sm ${logoutText} ${logoutHover} transition-colors duration-200 w-full text-left`}
                                    >
                                        <FiLogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}