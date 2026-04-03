"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import ThemeToggle from "@/components/ThemeToggle";
import RoleSwitcher from "@/components/RoleSwitcher";
import AddTransactionModal from "@/components/AddTransactionModal";
import useStore from "@/lib/store";
import { FiPlus, FiRefreshCw } from "react-icons/fi";

const SummaryCards = dynamic(() => import("@/components/SummaryCards"), { ssr: false });
const BalanceTrendChart = dynamic(() => import("@/components/BalanceTrendChart"), { ssr: false });
const SpendingBreakdown = dynamic(() => import("@/components/SpendingBreakdown"), { ssr: false });
const InsightsSection = dynamic(() => import("@/components/InsightsSection"), { ssr: false });
const TransactionsList = dynamic(() => import("@/components/TransactionsList"), { ssr: false });

export default function DashboardClient({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, resetToMockData } = useStore();

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finance Dashboard</h1>
            <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
              {role === "admin" ? "You have full access to manage transactions" : "You are in view-only mode"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {role === "admin" && (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] rounded-lg text-sm font-medium hover:bg-[hsl(var(--muted-foreground))] transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  Add Transaction
                </button>
                <button
                  onClick={resetToMockData}
                  className="p-2 rounded-lg bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))] transition-colors"
                  title="Reset to mock data"
                >
                  <FiRefreshCw className="w-4 h-4" />
                </button>
              </>
            )}
            <RoleSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
