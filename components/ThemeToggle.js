// components/ThemeToggle.js - Advanced version with View Transition API
"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = storedTheme === 'dark' || (!storedTheme && systemPrefersDark);
        setDarkMode(isDark);

        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDarkMode = useCallback(async () => {
        const button = buttonRef.current;
        if (!button) return;

        const newDarkMode = !darkMode;

        // Get button position for animation origin
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const applyTheme = () => {
            setDarkMode(newDarkMode);
            localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
            document.documentElement.classList.toggle('dark');
        };

        // Check if View Transition API is supported
        if (typeof document.startViewTransition !== 'function') {
            applyTheme();
            return;
        }

        // Start view transition with radial wipe effect
        const transition = document.startViewTransition(() => {
            // Use flushSync for immediate state update
            applyTheme();
        });

        await transition.ready;

        // Animate from button position outward (radial wipe)
        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0% at ${x}px ${y}px)`,
                    `circle(150% at ${x}px ${y}px)`
                ],
            },
            {
                duration: 1000,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                pseudoElement: '::view-transition-new(root)',
                fill: 'both' // 🔥 IMPORTANT
            }
          );
    }, [darkMode]);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <button
                ref={buttonRef}
                className="p-2 rounded-lg bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] transition-all duration-1000"
            >
                <div className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            ref={buttonRef}
            onClick={toggleDarkMode}
            className="relative p-2 rounded-lg bg-[hsl(var(--muted))] hover:bg-[hsl(var(--accent))] transition-all duration-1000 group overflow-hidden"
            aria-label="Toggle theme"
        >
            {/* Gradient background on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon with scale animation */}
            <div className="relative z-10 transition-transform duration-1000 group-hover:scale-110">
                {darkMode ? (
                    <FiSun className="w-5 h-5 text-[hsl(var(--foreground))]" />
                ) : (
                    <FiMoon className="w-5 h-5 text-[hsl(var(--foreground))]" />
                )}
            </div>
        </button>
    );
}