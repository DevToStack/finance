"use client";

import { SidebarProvider } from '@/context/useSidebar';
import MainLayout from './MainLayout';

export default function DashboardLayout({ children }) {
    return (

        <SidebarProvider>
            <MainLayout>{children}</MainLayout>
        </SidebarProvider>

    );
}