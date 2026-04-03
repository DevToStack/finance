"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

// Inner component that uses the sidebar context
function DashboardContent({ children }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 max-w-7xl">
          {/* Mobile spacer for top bar */}
          <div className="md:hidden h-16" />
          <div
            className="transition-all duration-300 px-4 sm:px-6 lg:px-8 py-8"
            style={{
              marginLeft: isCollapsed ? '5rem' : '15rem'
            }}
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