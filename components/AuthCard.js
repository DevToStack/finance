// components/AuthCard.js
"use client";

import { useTheme } from '@/hooks/useTheme';
import { FiDollarSign } from 'react-icons/fi';

export default function AuthCard({ children, title, subtitle }) {
    const { isDark } = useTheme();

    // Theme-based classes
    const bgGradient = isDark
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-blue-50 to-indigo-100';

    const cardBg = isDark ? 'bg-black' : 'bg-white';
    const cardBorder = isDark ? 'border border-gray-800' : '';
    const cardShadow = isDark ? 'shadow-2xl' : 'shadow-xl';

    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';

    const iconBg = isDark ? 'bg-blue-700' : 'bg-blue-600';
    const iconColor = 'text-white';

    const inputBg = isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300';
    const inputText = isDark ? 'text-white' : 'text-gray-900';
    const inputLabel = isDark ? 'text-gray-300' : 'text-gray-700';
    const inputBorder = isDark ? 'focus:border-blue-500' : 'focus:border-blue-500';

    const buttonBg = isDark ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700';
    const buttonText = 'text-white';

    const linkColor = isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500';
    const errorBg = isDark ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200';
    const errorText = isDark ? 'text-red-400' : 'text-red-600';

    const dividerBg = isDark ? 'bg-gray-800' : 'bg-gray-200';
    const dividerText = isDark ? 'text-gray-500' : 'text-gray-500';

    return (
        <div className={`min-h-screen ${bgGradient} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <div className={`h-16 w-16 ${iconBg} rounded-full flex items-center justify-center shadow-lg transition-colors duration-300`}>
                            <FiDollarSign className={`h-8 w-8 ${iconColor}`} />
                        </div>
                    </div>
                    <h2 className={`mt-6 text-center text-3xl font-extrabold ${textPrimary} transition-colors duration-300`}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p className={`mt-2 text-center text-sm ${textSecondary} transition-colors duration-300`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`${cardBg} ${cardBorder} py-8 px-4 ${cardShadow} rounded-lg sm:px-10 transition-all duration-300`}>
                    {children}
                </div>
            </div>
        </div>
    );
}