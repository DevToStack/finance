// components/Alert.js
"use client";

import { useEffect, useState } from 'react';

export default function Alert({ message, type = 'error', onClose, autoHide = true, duration = 5000 }) {
    const [isVisible, setIsVisible] = useState(true);
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

    useEffect(() => {
        if (autoHide && message) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, autoHide, duration, onClose]);

    if (!isVisible || !message) return null;

    // Theme-aware styles for each alert type
    const getTypeStyles = () => {
        const styles = {
            error: {
                light: 'bg-red-50 border-red-500 text-red-800',
                dark: 'bg-red-950/30 border-red-600 text-red-200',
                icon: isDark ? 'text-red-400' : 'text-red-500',
                closeIcon: isDark ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'
            },
            success: {
                light: 'bg-green-50 border-green-500 text-green-800',
                dark: 'bg-green-950/30 border-green-600 text-green-200',
                icon: isDark ? 'text-green-400' : 'text-green-500',
                closeIcon: isDark ? 'text-green-400 hover:text-green-300' : 'text-green-500 hover:text-green-700'
            },
            warning: {
                light: 'bg-yellow-50 border-yellow-500 text-yellow-800',
                dark: 'bg-yellow-950/30 border-yellow-600 text-yellow-200',
                icon: isDark ? 'text-yellow-400' : 'text-yellow-500',
                closeIcon: isDark ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-500 hover:text-yellow-700'
            },
            info: {
                light: 'bg-blue-50 border-blue-500 text-blue-800',
                dark: 'bg-blue-950/30 border-blue-600 text-blue-200',
                icon: isDark ? 'text-blue-400' : 'text-blue-500',
                closeIcon: isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'
            }
        };

        const typeStyle = styles[type] || styles.info;
        return {
            container: isDark ? typeStyle.dark : typeStyle.light,
            icon: typeStyle.icon,
            closeIcon: typeStyle.closeIcon
        };
    };

    const typeStyles = getTypeStyles();

    const icons = {
        error: (
            <svg className={`h-5 w-5 ${typeStyles.icon}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        ),
        success: (
            <svg className={`h-5 w-5 ${typeStyles.icon}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ),
        warning: (
            <svg className={`h-5 w-5 ${typeStyles.icon}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ),
        info: (
            <svg className={`h-5 w-5 ${typeStyles.icon}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
        )
    };

    return (
        <div className={`border-l-4 p-4 mb-4 rounded-lg shadow-sm transition-all duration-300 animate-slideIn ${typeStyles.container}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {icons[type] || icons.info}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm">{message}</p>
                </div>
                {onClose && (
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            onClose();
                        }}
                        className={`ml-auto transition-colors duration-200 ${typeStyles.closeIcon}`}
                        aria-label="Close alert"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

// Add animation styles to your global CSS or use Tailwind animations
// You can add this to your global.css or tailwind.config.js
const styles = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-slideIn {
        animation: slideIn 0.3s ease-out;
    }
`;

// If you want to use the animation, add it to your component or global styles