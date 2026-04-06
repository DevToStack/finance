// middleware/auth.js
import jwt from 'jsonwebtoken';

export function authenticateToken(request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return { error: 'Access token required', status: 401 };
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user };
    } catch (error) {
        return { error: 'Invalid or expired token', status: 403 };
    }
}