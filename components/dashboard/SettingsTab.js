"use client";

import { useFinance } from '@/context/FinanceContext';
import { useState, useEffect } from 'react';
import ProfileSettings from '@/components/settings/ProfileSettings';
import PreferencesSettings from '@/components/settings/PreferencesSettings';
import DataManagement from '@/components/settings/DataManagement';
import { FiUser, FiSettings, FiDatabase, FiBell } from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsTab() {
    const [activeSection, setActiveSection] = useState('profile');
    const {isDark} = useTheme();


    const sections = [
        { id: 'profile', label: 'Profile', icon: FiUser },
        { id: 'preferences', label: 'Preferences', icon: FiSettings },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'data', label: 'Data Management', icon: FiDatabase }
    ];

    // Dynamic classes based on theme
    const textPrimary = isDark ? 'text-white' : 'text-gray-800';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const sidebarBtnActive = isDark ? 'bg-gray-900 text-blue-400' : 'bg-blue-50 text-blue-600';
    const sidebarBtnInactive = isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700';
    const comingSoonBg = isDark ? 'bg-gray-950 border-gray-700' : 'bg-white border-gray-100';
    const comingSoonText = isDark ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className="space-y-6">
            <div>
                <h2 className={`text-2xl font-bold ${textPrimary}`}>Settings</h2>
                <p className={`${textSecondary} mt-1`}>Manage your account and preferences</p>
            </div>

            <div className="flex gap-6 flex-col md:flex-row">
                {/* Sidebar */}
                <div className="md:w-64 space-y-1">
                    {sections.map(section => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${isActive ? sidebarBtnActive : sidebarBtnInactive
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-current' : ''
                                    }`} />
                                <span className="text-sm font-medium">{section.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1 h-1 bg-current rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeSection === 'profile' && <ProfileSettings />}
                    {activeSection === 'preferences' && <PreferencesSettings />}
                    {activeSection === 'notifications' && (
                        <div className={`${comingSoonBg} rounded-xl shadow-sm p-12 text-center border transition-all duration-300`}>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiBell className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>Notification Settings</h3>
                                    <p className={`${comingSoonText}`}>
                                        We're working on bringing you customizable notification preferences.
                                    </p>
                                    <p className={`${comingSoonText} text-sm mt-1`}>
                                        Stay tuned for updates!
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <span className={`px-3 py-1 text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full`}>
                                        Coming Soon
                                    </span>
                                    <span className={`px-3 py-1 text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full`}>
                                        Q1 2025
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeSection === 'data' && <DataManagement />}
                </div>
            </div>
        </div>
    );
}