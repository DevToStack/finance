"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) {
                setIsMobileOpen(false); // Close mobile sidebar on desktop
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Load collapsed state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved !== null) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    // Save collapsed state
    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            setIsCollapsed,
            isMobileOpen,
            setIsMobileOpen,
            isMobile
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}