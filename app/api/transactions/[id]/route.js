// app/api/transactions/[id]/route.js
import { NextResponse } from 'next/server';
import { authenticateToken } from '@/middleware/auth';
import pool from '@/lib/db';

// GET /api/transactions/[id] - Get single transaction
export async function GET(request, { params }) {
    try {
        const auth = authenticateToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const { id } = await  params;

        const [transactions] = await pool.execute(
            `SELECT transaction_id, amount, category, type, description, 
                    transaction_date, created_at 
             FROM transactions 
             WHERE transaction_id = ? AND user_id = ?`,
            [id, auth.user.user_id]
        );

        if (transactions.length === 0) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(transactions[0]);

    } catch (error) {
        console.error('Get transaction error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/transactions/[id] - Update transaction
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
        const { amount, category, type, description, transaction_date } = await request.json();

        // Check if transaction exists and belongs to user
        const [existing] = await pool.execute(
            'SELECT transaction_id FROM transactions WHERE transaction_id = ? AND user_id = ?',
            [id, auth.user.user_id]
        );

        if (existing.length === 0) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (amount !== undefined) {
            updates.push('amount = ?');
            values.push(amount);
        }
        if (category !== undefined) {
            updates.push('category = ?');
            values.push(category);
        }
        if (type !== undefined) {
            updates.push('type = ?');
            values.push(type);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (transaction_date !== undefined) {
            updates.push('transaction_date = ?');
            values.push(transaction_date);
        }

        if (updates.length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            );
        }

        values.push(id, auth.user.user_id);
        await pool.execute(
            `UPDATE transactions SET ${updates.join(', ')} WHERE transaction_id = ? AND user_id = ?`,
            values
        );

        // Get updated transaction
        const [updated] = await pool.execute(
            'SELECT transaction_id, amount, category, type, description, transaction_date, created_at FROM transactions WHERE transaction_id = ?',
            [id]
        );

        return NextResponse.json(updated[0]);

    } catch (error) {
        console.error('Update transaction error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/transactions/[id] - Delete transaction
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
            'DELETE FROM transactions WHERE transaction_id = ? AND user_id = ?',
            [id, auth.user.user_id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Transaction deleted successfully'
        });

    } catch (error) {
        console.error('Delete transaction error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}