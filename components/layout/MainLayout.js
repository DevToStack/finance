"use client";

import { useSidebar } from '@/context/useSidebar';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiMenu, FiUser, FiChevronDown, FiUser as FiUserIcon, FiSettings, FiShield, FiLogOut } from 'react-icons/fi';
import { useEffect, useState, useRef } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useRouter } from 'next/navigation';

export default function MainLayout({ children }) {
    const { toggleSidebar, isOpen } = useSidebar();
    const [isDark, setIsDark] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout, isAuthenticated } = useFinance();
    const router = useRouter();
    const [userName, setUserName] = useState('User');
    const [userEmail, setUserEmail] = useState('user@example.com');

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

    const handleProfileSettings = () => {
        setIsDropdownOpen(false);
        router.push('/dashboard/profile');
    };

    const handleAccountSettings = () => {
        setIsDropdownOpen(false);
        router.push('/dashboard/account');
    };

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await logout();
        router.push('/login');
    };

    // Dynamic classes based on theme
    const bgColor = isDark ? 'bg-black' : 'bg-gray-50';
    const mobileHeaderBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
    const mobileHeaderBtnHover = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
    const mobileBtnColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const dropdownBg = isDark ? 'bg-gray-900' : 'bg-white';
    const dropdownBorder = isDark ? 'border-gray-700' : 'border-gray-200';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const textTertiary = isDark ? 'text-gray-500' : 'text-gray-400';
    const hoverBg = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

    return (
        <div className={`${bgColor} min-h-screen overflow-hidden`}>
            {/* Mobile Header */}
            <div className={`md:hidden fixed top-0 left-0 right-0 ${mobileHeaderBg} border-b z-30 px-4 py-3`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleSidebar}
                            className={`p-2 rounded-lg ${mobileHeaderBtnHover} ${mobileBtnColor} transition-colors`}
                            aria-label="Toggle sidebar"
                        >
                            <FiMenu className="w-5 h-5" />
                        </button>

                        {/* App Name */}
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h1 className={`text-lg font-semibold ${textPrimary} tracking-tight`}>
                                Xpenso
                            </h1>
                        </div>
                    </div>

                    {/* User Avatar with Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${mobileHeaderBtnHover} transition-colors`}
                        >
                            <div className="w-7 h-7 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full flex items-center justify-center">
                                <FiUser className="w-3.5 h-3.5 text-white" />
                            </div>
                            <FiChevronDown className={`w-3.5 h-3.5 ${mobileBtnColor} transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-72 ${dropdownBg} ${dropdownBorder} border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50`}>
                                {/* User Details */}
                                <div className={`p-4 ${dropdownBorder} border-b`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full flex items-center justify-center">
                                            <FiUserIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-semibold ${textPrimary}`}>{userName}</p>
                                            <p className={`text-xs ${textTertiary} truncate`}>{userEmail}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button
                                        onClick={handleProfileSettings}
                                        className={`w-full px-4 py-2.5 flex items-center gap-3 ${hoverBg} transition-colors group`}
                                    >
                                        <FiUserIcon className={`w-4 h-4 ${textSecondary} group-hover:scale-105 transition-transform`} />
                                        <span className={`text-sm ${textPrimary} flex-1 text-left`}>Profile Settings</span>
                                    </button>

                                    <button
                                        onClick={handleAccountSettings}
                                        className={`w-full px-4 py-2.5 flex items-center gap-3 ${hoverBg} transition-colors group`}
                                    >
                                        <FiShield className={`w-4 h-4 ${textSecondary} group-hover:scale-105 transition-transform`} />
                                        <span className={`text-sm ${textPrimary} flex-1 text-left`}>Account Settings</span>
                                    </button>

                                    <div className={`my-2 ${dropdownBorder} border-t`} />

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
                </div>
            </div>

            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide mt-14 md:mt-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}