// app/api/budgets/[id]/route.js
import { NextResponse } from 'next/server';
import { authenticateToken } from '@/middleware/auth';
import pool from '@/lib/db';

// GET /api/budgets/[id] - Get single budget
export async function GET(request, { params }) {
    try {
        const auth = authenticateToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const { id } = await params;

        const [budgets] = await pool.execute(
            'SELECT * FROM budgets WHERE budget_id = ? AND user_id = ?',
            [id, auth.user.user_id]
        );

        if (budgets.length === 0) {
            return NextResponse.json(
                { error: 'Budget not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(budgets[0]);

    } catch (error) {
        console.error('Get budget error:', error);
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

        const { id } = await params;
        const { amount, spent, month, category } = await request.json();

        // Check if budget exists and belongs to user
        const [existing] = await pool.execute(
            'SELECT budget_id FROM budgets WHERE budget_id = ? AND user_id = ?',
            [id, auth.user.user_id]
        );

        if (existing.length === 0) {
            return NextResponse.json(
                { error: 'Budget not found' },
                { status: 404 }
            );
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (amount !== undefined) {
            if (isNaN(amount) || amount <= 0) {
                return NextResponse.json(
                    { error: 'Amount must be a positive number' },
                    { status: 400 }
                );
            }
            updates.push('amount = ?');
            values.push(amount);
        }

        if (spent !== undefined) {
            if (isNaN(spent) || spent < 0) {
                return NextResponse.json(
                    { error: 'Spent amount must be a non-negative number' },
                    { status: 400 }
                );
            }
            updates.push('spent = ?');
            values.push(spent);
        }

        if (month !== undefined) {
            updates.push('month = ?');
            values.push(month);
        }

        if (category !== undefined) {
            updates.push('category = ?');
            values.push(category);
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

        // Get updated budget
        const [updated] = await pool.execute(
            'SELECT * FROM budgets WHERE budget_id = ?',
            [id]
        );

        return NextResponse.json(updated[0]);

    } catch (error) {
        console.error('Update budget error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
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

        const { id } = await params;

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

        return NextResponse.json({
            message: 'Budget deleted successfully',
            success: true
        });

    } catch (error) {
        console.error('Delete budget error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}