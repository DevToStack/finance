"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome, FiTrendingUp, FiTrendingDown, FiDollarSign,
    FiSettings, FiLogOut, FiChevronLeft,
    FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { useSidebar } from '@/contexts/SidebarContext';

export default function Sidebar() {
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { name: 'Overview', icon: FiHome, href: '/dashboard' },
        { name: 'Income', icon: FiTrendingUp, href: '/dashboard/income' },
        { name: 'Expenses', icon: FiTrendingDown, href: '/dashboard/expenses' },
        { name: 'Balance', icon: FiDollarSign, href: '/dashboard/balance' },
    ];

    const isActive = (href) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard' || pathname === '/dashboard/';
        }
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <>
            {/* Desktop Sidebar - Always fixed and non-scrollable */}
            <div className={`hidden md:flex bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] h-screen fixed left-0 top-0 transition-all duration-300 z-20 overflow-hidden ${isCollapsed ? 'w-20' : 'w-60'}`}>
                <div className="flex flex-col h-full w-full">
                    <div className="flex items-center justify-between px-4 h-16 border-b border-[hsl(var(--border))] flex-shrink-0">
                        {!isCollapsed ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">F</span>
                                </div>
                                <span className="font-semibold text-[hsl(var(--foreground))]">Finance</span>
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto">
                                <span className="text-white text-sm font-bold">F</span>
                            </div>
                        )}
                        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 rounded-lg hover:bg-[hsl(var(--muted))] flex-shrink-0">
                            <FiChevronLeft className={`w-4 h-4 text-[hsl(var(--muted-foreground))] transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-6 overflow-y-auto">
                        <div className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                const LinkComponent = isCollapsed ? 'a' : Link;
                                const linkProps = isCollapsed ? { href: item.href } : { href: item.href };
                                return (
                                    <LinkComponent key={item.name} {...linkProps}
                                        className={`relative flex items-center px-3 py-3 rounded-lg text-sm font-bold transition-all duration-200 group
                                        ${active ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}
                                        ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                                        {active && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-6 bg-blue-500 rounded"></div>
                                        )}
                                        <Icon className={`w-5 h-5 ${active ? 'text-blue-500' : 'text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]'}`} />
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </LinkComponent>
                                );
                            })}
                        </div>
                    </nav>

                    <div className="border-t border-[hsl(var(--border))] px-3 py-4 flex-shrink-0">
                        <div className={`flex items-center px-3 py-2 ${isCollapsed ? 'justify-center' : ''}`}>
                            <ThemeToggle />
                        </div>
                        {!isCollapsed && (
                            <div className="space-y-1 mt-2">
                                <a href="#" className="flex items-center px-3 py-3 rounded-lg text-sm font-bold text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-all duration-200">
                                    <FiSettings className="w-5 h-5 mr-3" />
                                    <span>Settings</span>
                                </a>
                                <a href="#" className="flex items-center px-3 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200">
                                    <FiLogOut className="w-5 h-5 mr-3" />
                                    <span>Logout</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] h-16 px-4 flex items-center justify-between z-30">
                <button onClick={() => setIsMobileOpen(true)} className="p-2 rounded-lg hover:bg-[hsl(var(--muted))]">
                    <FiMenu className="w-6 h-6 text-[hsl(var(--foreground))]" />
                </button>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">F</span>
                    </div>
                    <span className="font-semibold text-[hsl(var(--foreground))]">Finance</span>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isMobileOpen ? 'visible' : 'invisible'}`}>
                <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isMobileOpen ? 'opacity-50' : 'opacity-0'}`}
                    onClick={() => setIsMobileOpen(false)} />

                <div className={`absolute top-0 left-0 h-full w-64 bg-[hsl(var(--card))] shadow-xl transition-transform duration-300 ease-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between px-4 h-16 border-b border-[hsl(var(--border))] flex-shrink-0">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">F</span>
                                </div>
                                <span className="font-semibold text-[hsl(var(--foreground))]">Finance</span>
                            </div>
                            <button onClick={() => setIsMobileOpen(false)} className="p-1 rounded-lg hover:bg-[hsl(var(--muted))]">
                                <FiX className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
                            </button>
                        </div>

                        <nav className="flex-1 px-3 py-6 overflow-y-auto">
                            <div className="space-y-1">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link key={item.name} href={item.href} onClick={() => setIsMobileOpen(false)}
                                            className={`relative flex items-center px-3 py-3 rounded-lg text-sm font-bold transition-all duration-200 group
                                        ${active ? 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}
                                        space-x-3`}>
                                            {active && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-6 bg-blue-500 rounded"></div>
                                            )}
                                            <Icon className={`w-5 h-5 ${active ? 'text-blue-500' : 'text-[hsl(var(--muted-foreground))]'}`} />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        <div className="border-t border-[hsl(var(--border))] px-3 py-4 flex-shrink-0">
                            <a href="#" className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-bold text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]">
                                <FiSettings className="w-5 h-5" />
                                <span>Settings</span>
                            </a>
                            <a href="#" className="flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                                <FiLogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}