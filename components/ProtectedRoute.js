// components/ProtectedRoute.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const { isAuthenticated, loading } = useFinance();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return isAuthenticated ? children : null;
}