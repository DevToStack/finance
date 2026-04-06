// app/api/analytics/summary/route.js
import { NextResponse } from 'next/server';
import { authenticateToken } from '@/middleware/auth';
import pool from '@/lib/db';

export async function GET(request) {
    try {
        const auth = authenticateToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        let dateFilter = '';
        const params = [auth.user.user_id];

        if (startDate && endDate) {
            dateFilter = 'AND transaction_date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        // Get total income and expense
        const [totals] = await pool.execute(
            `SELECT 
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
             FROM transactions 
             WHERE user_id = ? ${dateFilter}`,
            params
        );

        // Get expenses by category
        const [expensesByCategory] = await pool.execute(
            `SELECT category, SUM(amount) as total
             FROM transactions 
             WHERE user_id = ? AND type = 'expense' ${dateFilter}
             GROUP BY category
             ORDER BY total DESC`,
            params
        );

        // Get income by category
        const [incomeByCategory] = await pool.execute(
            `SELECT category, SUM(amount) as total
             FROM transactions 
             WHERE user_id = ? AND type = 'income' ${dateFilter}
             GROUP BY category
             ORDER BY total DESC`,
            params
        );

        const balance = (totals[0].total_income || 0) - (totals[0].total_expense || 0);

        return NextResponse.json({
            total_income: totals[0].total_income || 0,
            total_expense: totals[0].total_expense || 0,
            balance: balance,
            expenses_by_category: expensesByCategory,
            income_by_category: incomeByCategory
        });

    } catch (error) {
        console.error('Get summary error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}