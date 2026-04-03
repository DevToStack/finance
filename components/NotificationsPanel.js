// components/NotificationsPanel.js
"use client";
import { useState } from 'react';
import { 
    FiBell, FiCheck, FiCheckCircle, FiAlertCircle, 
    FiInfo, FiX, FiTrash2 
} from 'react-icons/fi';
import useStore from '@/lib/store';

const NOTIFICATION_ICONS = {
    success: { icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
    warning: { icon: FiAlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30' },
    info: { icon: FiInfo, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    error: { icon: FiAlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' }
};

export default function NotificationsPanel() {
    const { notifications, markNotificationRead, markAllNotificationsRead, clearNotification } = useStore();
    const [isOpen, setIsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                                <p className="text-sm text-gray-500">
                                    {unreadCount} unread
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllNotificationsRead()}
                                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        title="Mark all as read"
                                    >
                                        <FiCheck className="w-4 h-4 text-gray-500" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <FiX className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <FiBell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {notifications.map((notification) => {
                                        const { icon: Icon, color, bg } = NOTIFICATION_ICONS[notification.type];
                                        return (
                                            <div
                                                key={notification.id}
                                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                                                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${bg} shrink-0`}>
                                                        <Icon className={`w-4 h-4 ${color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {notification.title}
                                                            </p>
                                                            <span className="text-xs text-gray-400 shrink-0">
                                                                {notification.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            {!notification.read && (
                                                                <button
                                                                    onClick={() => markNotificationRead(notification.id)}
                                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                                >
                                                                    Mark as read
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => clearNotification(notification.id)}
                                                                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                                                            >
                                                                <FiTrash2 className="w-3 h-3" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
