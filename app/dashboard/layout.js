"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { useEffect, useState } from "react";

// Inner component that uses the sidebar context
function DashboardContent({ children }) {
  const { isCollapsed, isMobileOpen } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Mobile overlay when sidebar is open */}
      {isMobile && isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" />
      )}

      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />

        <main className="flex-1 min-w-0 transition-all duration-300 overflow-y-auto max-h-screen">
          {/* Mobile spacer for top bar */}
          <div className="md:hidden h-16" />

          <div
            className="px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300"

          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Main layout component with provider
export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}