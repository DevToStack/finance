// components/ThemeProvider.jsx
"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeTheme = () => {
            const savedTheme = localStorage.getItem("theme");
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

            // Remove any existing theme classes first
            document.documentElement.classList.remove("dark", "light");

            if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.add("light");
            }

            setIsInitialized(true);
        };

        initializeTheme();

        // Optional: Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleSystemChange = (e) => {
            // Only apply if user hasn't manually set a preference
            if (!localStorage.getItem("theme")) {
                if (e.matches) {
                    document.documentElement.classList.add("dark");
                    document.documentElement.classList.remove("light");
                } else {
                    document.documentElement.classList.add("light");
                    document.documentElement.classList.remove("dark");
                }
            }
        };

        mediaQuery.addEventListener("change", handleSystemChange);
        return () => mediaQuery.removeEventListener("change", handleSystemChange);
    }, []);

    // Prevent flash of incorrect theme
    if (!isInitialized) {
        return null; // or a loading skeleton
    }

    return children;
}