// app/api/analytics/trends/route.js
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
        const year = searchParams.get('year') || new Date().getFullYear();

        const [trends] = await pool.execute(
            `SELECT 
                DATE_FORMAT(transaction_date, '%Y-%m') as month,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
             FROM transactions 
             WHERE user_id = ? AND YEAR(transaction_date) = ?
             GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
             ORDER BY month ASC`,
            [auth.user.user_id, year]
        );

        return NextResponse.json(trends);

    } catch (error) {
        console.error('Get trends error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}