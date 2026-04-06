// lib/api.js
const API_BASE_URL = '/api';

class ApiClient {
    constructor() {
        this.token = null;
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('token');
        }
    }

    setToken(token) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('token', token);
            } else {
                localStorage.removeItem('token');
            }
        }
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }

        return data;
    }

    // Auth endpoints
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        if (data.token) {
            this.setToken(data.token);
        }
        return data;
    }

    logout() {
        this.setToken(null);
    }

    async getProfile() {
        return this.request('/user/profile');
    }

    async updateProfile(userData) {
        return this.request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    // Transaction endpoints
    async getTransactions(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return this.request(`/transactions${params ? `?${params}` : ''}`);
    }

    async getTransaction(id) {
        return this.request(`/transactions/${id}`);
    }

    async createTransaction(transaction) {
        return this.request('/transactions', {
            method: 'POST',
            body: JSON.stringify(transaction)
        });
    }

    async updateTransaction(id, transaction) {
        return this.request(`/transactions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(transaction)
        });
    }

    async deleteTransaction(id) {
        return this.request(`/transactions/${id}`, {
            method: 'DELETE'
        });
    }

    // Analytics endpoints
    async getSummary(startDate, endDate) {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return this.request(`/analytics/summary${params.toString() ? `?${params}` : ''}`);
    }

    async getTrends(year) {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        return this.request(`/analytics/trends${params.toString() ? `?${params}` : ''}`);
    }
}

export const api = new ApiClient();