"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import { cn } from "@/lib/utils";

export const AnimatedThemeToggler = ({
    className,
    duration = 400,
    ...props
}) => {
    const [isDark, setIsDark] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const buttonRef = useRef(null);

    // Initialize theme on mount
    useEffect(() => {
        // Get saved theme from localStorage
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Determine initial theme
        const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

        // Apply theme
        if (shouldBeDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        // Update state
        setIsDark(shouldBeDark);
        setIsMounted(true);
    }, []);

    // Watch for theme changes from other sources
    useEffect(() => {
        if (!isMounted) return;

        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, [isMounted]);

    const toggleTheme = useCallback(() => {
        const button = buttonRef.current;
        if (!button) return;

        const { top, left, width, height } = button.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const maxRadius = Math.hypot(
            Math.max(x, viewportWidth - x),
            Math.max(y, viewportHeight - y)
        );

        const applyTheme = () => {
            const newTheme = !isDark;
            setIsDark(newTheme);

            if (newTheme) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
        };

        if (typeof document.startViewTransition !== "function") {
            applyTheme();
            return;
        }

        const transition = document.startViewTransition(() => {
            flushSync(applyTheme);
        });

        const ready = transition?.ready;
        if (ready && typeof ready.then === "function") {
            ready.then(() => {
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${maxRadius}px at ${x}px ${y}px)`,
                        ],
                    },
                    {
                        duration,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );
            });
        }
    }, [isDark, duration]);

    // Prevent hydration mismatch by not rendering until mounted
    if (!isMounted) {
        return (
            <button
                type="button"
                className={cn(className)}
                {...props}
            >
                <div className="w-5 h-5" />
                <span className="sr-only">Toggle theme</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            ref={buttonRef}
            onClick={toggleTheme}
            className={cn(className)}
            {...props}
        >
            {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
};