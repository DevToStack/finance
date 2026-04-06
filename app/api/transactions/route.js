// app/api/transactions/route.js

import { NextResponse } from "next/server";
import { authenticateToken } from "@/middleware/auth";
import pool from "@/lib/db";

// FIXED: Convert UTC ISO string to MySQL datetime (storing UTC)
const formatDateTimeForMySQL = (dateTime) => {
    if (!dateTime) return null;

    // Parse the ISO string (which should be UTC)
    const d = new Date(dateTime);
    if (isNaN(d.getTime())) return null;

    // Extract UTC components to store in database
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const seconds = String(d.getUTCSeconds()).padStart(2, '0');

    // Return MySQL datetime string (will be stored as UTC)
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Helper for date-only queries (without time component)
const formatDateForMySQL = (date) => {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null;
    // Use UTC to maintain consistency
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
};

// GET /api/transactions - Get all transactions for authenticated user
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
        let startDate = searchParams.get('startDate');
        let endDate = searchParams.get('endDate');
        const type = searchParams.get('type');
        const category = searchParams.get('category');

        if (startDate) startDate = formatDateForMySQL(startDate);
        if (endDate) endDate = formatDateForMySQL(endDate);

        let query = `
            SELECT transaction_id, amount, category, type, description, 
                   transaction_date, created_at
            FROM transactions 
            WHERE user_id = ?
        `;
        const params = [auth.user.user_id];

        if (startDate) {
            query += ' AND DATE(transaction_date) >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND DATE(transaction_date) <= ?';
            params.push(endDate);
        }

        if (type && ['income', 'expense'].includes(type)) {
            query += ' AND type = ?';
            params.push(type);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY transaction_date DESC, created_at DESC';

        const [transactions] = await pool.execute(query, params);

        // FIXED: Convert MySQL datetime (stored as UTC) to ISO string
        const formattedTransactions = transactions.map(t => ({
            ...t,
            transaction_date: t.transaction_date ? new Date(t.transaction_date).toISOString() : null
        }));

        return NextResponse.json(formattedTransactions);

    } catch (error) {
        console.error('Get transactions error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/transactions - Create new transaction
export async function POST(request) {
    try {
        const auth = authenticateToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const { amount, category, type, description, transaction_date } = await request.json();

        // Validate required fields
        if (!amount || !category || !type || !transaction_date) {
            return NextResponse.json(
                { error: 'Amount, category, type, and transaction_date are required' },
                { status: 400 }
            );
        }

        if (!['income', 'expense'].includes(type)) {
            return NextResponse.json(
                { error: 'Type must be either income or expense' },
                { status: 400 }
            );
        }

        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json(
                { error: 'Amount must be a positive number' },
                { status: 400 }
            );
        }

        // FIXED: Convert UTC ISO string to MySQL datetime
        const formattedDateTime = formatDateTimeForMySQL(transaction_date);

        if (!formattedDateTime) {
            return NextResponse.json(
                { error: 'Invalid date format. Please provide a valid ISO date string.' },
                { status: 400 }
            );
        }

        console.log('Saving transaction:', {
            received: transaction_date,
            formatted: formattedDateTime
        });

        const [result] = await pool.execute(
            `INSERT INTO transactions 
             (user_id, amount, category, type, description, transaction_date) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [auth.user.user_id, amount, category, type, description || null, formattedDateTime]
        );

        const [newTransaction] = await pool.execute(
            `SELECT transaction_id, amount, category, type, description, 
                    transaction_date, created_at 
             FROM transactions WHERE transaction_id = ?`,
            [result.insertId]
        );

        // FIXED: Convert back to ISO string for response
        const formattedResponse = {
            ...newTransaction[0],
            transaction_date: newTransaction[0].transaction_date ?
                new Date(newTransaction[0].transaction_date).toISOString() : null
        };

        return NextResponse.json(formattedResponse, { status: 201 });

    } catch (error) {
        console.error('Create transaction error:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
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
            // FIXED: Convert UTC ISO string to MySQL datetime
            const formattedDateTime = formatDateTimeForMySQL(transaction_date);
            if (!formattedDateTime) {
                return NextResponse.json(
                    { error: 'Invalid date format. Please provide a valid ISO date string.' },
                    { status: 400 }
                );
            }
            updates.push('transaction_date = ?');
            values.push(formattedDateTime);
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
            `SELECT transaction_id, amount, category, type, description, 
                    transaction_date, created_at 
             FROM transactions WHERE transaction_id = ?`,
            [id]
        );

        // FIXED: Convert back to ISO string for response
        const formattedResponse = {
            ...updated[0],
            transaction_date: updated[0].transaction_date ?
                new Date(updated[0].transaction_date).toISOString() : null
        };

        return NextResponse.json(formattedResponse);

    } catch (error) {
        console.error('Update transaction error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}