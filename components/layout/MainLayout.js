"use client";

import { useSidebar } from '@/context/useSidebar';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiMenu } from 'react-icons/fi';
import { useEffect, useState } from 'react';

export default function MainLayout({ children }) {
    const { toggleSidebar, isOpen } = useSidebar();
    const [isDark, setIsDark] = useState(false);

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

    // Dynamic classes based on theme
    const bgColor = isDark ? 'bg-black' : 'bg-gray-50';
    const mobileHeaderBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
    const mobileHeaderBtnHover = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
    const mobileBtnColor = isDark ? 'text-gray-300' : 'text-gray-700';

    return (
        <div className={`${bgColor} min-h-screen overflow-hidden`}>
            {/* Mobile Header */}
            <div className={`md:hidden fixed top-0 left-0 right-0 ${mobileHeaderBg} border-b z-30 px-4 py-3`}>
                <button
                    onClick={toggleSidebar}
                    className={`p-2 rounded-lg ${mobileHeaderBtnHover} ${mobileBtnColor} `}
                    aria-label="Toggle sidebar"
                >
                    <FiMenu className="w-5 h-5" />
                </button>
            </div>

            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}