"use cient";
import { useContext, createContext, useState, useEffect} from "react";
import { usePathname } from "next/navigation";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // If using Next.js App Router
    const pathname = usePathname();

    // If using React Router
    // const location = useLocation();

    // Update active tab when route changes
    useEffect(() => {
        const path = pathname; // or location.pathname for React Router

        if (path === '/dashboard') setActiveTab('overview');
        else if (path === '/dashboard/expenses') setActiveTab('expense');
        else if (path === '/dashboard/income') setActiveTab('income');
        else if (path === '/dashboard/budget') setActiveTab('budget');
        else if (path === '/dashboard/settings') setActiveTab('settings');
    }, [pathname]); // or [location.pathname]

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <SidebarContext.Provider value={{
            isOpen,
            toggleSidebar,
            closeSidebar,
            activeTab,
            setActiveTab
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}