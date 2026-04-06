// app/api/user/profile/route.js
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

        const [users] = await pool.execute(
            'SELECT user_id, name, email, currency, created_at FROM users WHERE user_id = ?',
            [auth.user.user_id]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(users[0]);

    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const auth = authenticateToken(request);
        if (auth.error) {
            return NextResponse.json(
                { error: auth.error },
                { status: auth.status }
            );
        }

        const { name, currency } = await request.json();

        await pool.execute(
            'UPDATE users SET name = ?, currency = ? WHERE user_id = ?',
            [name, currency, auth.user.user_id]
        );

        return NextResponse.json({
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}