// hooks/useTheme.js
"use client";

import { useEffect, useState } from "react";

export const useTheme = () => {
    // Initialize with the ACTUAL current theme (not false)
    const [isDark, setIsDark] = useState(() => {
        // This runs once on component mount (client-side only)
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains("dark");
        }
        return false;
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Update state if theme changes
        const observer = new MutationObserver(() => {
            const isDarkMode = document.documentElement.classList.contains("dark");
            setIsDark(isDarkMode);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    // Always return the actual theme, mounted flag just indicates we're client-side
    return { isDark, mounted };
};