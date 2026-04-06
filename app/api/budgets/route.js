// app/api/budgets/route.js
import { NextResponse } from 'next/server';
import { authenticateToken } from '@/middleware/auth';
import pool from '@/lib/db';

// GET /api/budgets - Get all budgets for authenticated user
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
        const month = searchParams.get('month');

        let query = 'SELECT * FROM budgets WHERE user_id = ?';
        const params = [auth.user.user_id];

        if (month) {
            query += ' AND month = ?';
            params.push(month);
        }

        query += ' ORDER BY category';

        const [budgets] = await pool.execute(query, params);
        return NextResponse.json(budgets);

    } catch (error) {
        console.error('Get budgets error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/budgets - Create new budget
export async function POST(request) {
    try {
        const auth = authenticateToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const { category, amount, month } = await request.json();

        if (!category || !amount || !month) {
            return NextResponse.json(
                { error: 'Category, amount, and month are required' },
                { status: 400 }
            );
        }

        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json(
                { error: 'Amount must be a positive number' },
                { status: 400 }
            );
        }

        // Check if budget already exists for this category and month
        const [existing] = await pool.execute(
            'SELECT budget_id FROM budgets WHERE user_id = ? AND category = ? AND month = ?',
            [auth.user.user_id, category, month]
        );

        if (existing.length > 0) {
            return NextResponse.json(
                { error: 'Budget already exists for this category and month' },
                { status: 409 }
            );
        }

        const [result] = await pool.execute(
            `INSERT INTO budgets (user_id, category, amount, month) 
             VALUES (?, ?, ?, ?)`,
            [auth.user.user_id, category, amount, month]
        );

        const [newBudget] = await pool.execute(
            'SELECT * FROM budgets WHERE budget_id = ?',
            [result.insertId]
        );

        return NextResponse.json(newBudget[0], { status: 201 });

    } catch (error) {
        console.error('Create budget error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/budgets/[id] - Update budget
export async function PUT(request, { params }) {
    try {
        const auth = authenticateToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const { id } = params;
        const { amount, spent } = await request.json();

        const updates = [];
        const values = [];

        if (amount !== undefined) {
            updates.push('amount = ?');
            values.push(amount);
        }
        if (spent !== undefined) {
            updates.push('spent = ?');
            values.push(spent);
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            );
        }

        values.push(id, auth.user.user_id);
        await pool.execute(
            `UPDATE budgets SET ${updates.join(', ')} WHERE budget_id = ? AND user_id = ?`,
            values
        );

        const [updated] = await pool.execute(
            'SELECT * FROM budgets WHERE budget_id = ?',
            [id]
        );

        return NextResponse.json(updated[0]);

    } catch (error) {
        console.error('Update budget error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/budgets/[id] - Delete budget
export async function DELETE(request, { params }) {
    try {
        const auth = authenticateToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const { id } = params;

        const [result] = await pool.execute(
            'DELETE FROM budgets WHERE budget_id = ? AND user_id = ?',
            [id, auth.user.user_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Budget not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Budget deleted successfully' });

    } catch (error) {
        console.error('Delete budget error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}