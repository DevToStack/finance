// components/RoleSwitcher.js
"use client";
import useStore from '@/lib/store';
import { FiUser, FiShield } from 'react-icons/fi';

export default function RoleSwitcher() {
    const { role, setRole } = useStore();

    return (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
                onClick={() => setRole('viewer')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${role === 'viewer'
                        ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                <FiUser className="w-4 h-4" />
                Viewer
            </button>
            <button
                onClick={() => setRole('admin')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${role === 'admin'
                        ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
            >
                <FiShield className="w-4 h-4" />
                Admin
            </button>
        </div>
    );
}