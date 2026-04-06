"use client";

import { useState } from 'react';
import { FiBell, FiMail, FiGlobe, FiCalendar, FiCheck } from 'react-icons/fi';
import { AnimatedThemeToggler } from '../ThemeToggler';
import { useTheme } from '@/hooks/useTheme';

export default function PreferencesSettings() {
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: false,
        language: 'en',
        dateFormat: 'MM/DD/YYYY'
    });

    const [saveStatus, setSaveStatus] = useState(null);
    const {isDark} = useTheme();

    const toggleSetting = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    const handleReset = () => {
        setPreferences({
            emailNotifications: true,
            pushNotifications: false,
            language: 'en',
            dateFormat: 'MM/DD/YYYY'
        });
        setSaveStatus('reset');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    // Dynamic classes based on theme
    const cardBg = isDark ? 'bg-gray-950' : 'bg-white';
    const borderColor = isDark ? 'border-gray-900' : 'border-gray-100';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const textTertiary = isDark ? 'text-gray-500' : 'text-gray-400';
    const headerBg = isDark ? 'bg-gray-900/50' : 'bg-gradient-to-r from-gray-50 to-white';
    const hoverBg = isDark ? 'hover:bg-gray-900' : 'hover:shadow-sm';
    const selectBg = isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
    const themeCardBg = isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100';
    const iconBg = {
        email: isDark ? 'bg-blue-900/30' : 'bg-blue-50',
        push: isDark ? 'bg-purple-900/30' : 'bg-purple-50',
        language: isDark ? 'bg-green-900/30' : 'bg-green-50',
        date: isDark ? 'bg-orange-900/30' : 'bg-orange-50',
    };
    const iconColor = {
        email: isDark ? 'text-blue-400' : 'text-blue-600',
        push: isDark ? 'text-purple-400' : 'text-purple-600',
        language: isDark ? 'text-green-400' : 'text-green-600',
        date: isDark ? 'text-orange-400' : 'text-orange-600',
    };
    const toggleBg = (isEnabled) => {
        if (isEnabled) {
            return isDark ? 'bg-blue-600' : 'bg-blue-500';
        }
        return isDark ? 'bg-gray-700' : 'bg-gray-200';
    };
    const successBg = isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200';
    const successText = isDark ? 'text-green-400' : 'text-green-700';
    const resetBg = isDark ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200';
    const resetText = isDark ? 'text-blue-400' : 'text-blue-700';

    return (
        <div className="max-w-4xl mx-auto">
            <div className={`${cardBg} rounded-2xl shadow-sm ${borderColor} border overflow-hidden transition-all duration-300`}>
                {/* Header */}
                <div className={`px-6 py-5 ${borderColor} border-b ${headerBg} transition-colors duration-300`}>
                    <h3 className={`text-xl font-bold ${textPrimary}`}>Preferences</h3>
                    <p className={`text-sm ${textSecondary} mt-1`}>Customize your dashboard experience</p>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        {/* Theme Preference */}
                        <div className={`${themeCardBg} rounded-xl p-5 border transition-all duration-300`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 ${cardBg} rounded-xl flex items-center justify-center shadow-sm transition-colors duration-300`}>
                                        <AnimatedThemeToggler
                                            className="p-2 rounded-lg transition-all duration-300"
                                            duration={400}
                                        />
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${textPrimary}`}>Theme</p>
                                        <p className={`text-sm ${textSecondary} mt-0.5`}>Choose your preferred theme appearance</p>
                                    </div>
                                </div>
                                <div className={`text-xs ${textTertiary} ${isDark ? 'bg-gray-800' : 'bg-white/50'} px-3 py-1 rounded-full`}>
                                    Click to toggle
                                </div>
                            </div>
                            <div className="mt-3 flex gap-3">
                                <div className={`text-xs ${textSecondary} flex items-center gap-1`}>
                                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                                    Light
                                </div>
                                <div className={`text-xs ${textSecondary} flex items-center gap-1`}>
                                    <span className="inline-block w-2 h-2 rounded-full bg-gray-700 dark:bg-gray-400"></span>
                                    Dark
                                </div>
                                <div className={`text-xs ${textSecondary} flex items-center gap-1`}>
                                    <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                                    Animation
                                </div>
                            </div>
                        </div>

                        {/* Notifications Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                <h4 className={`font-semibold ${textPrimary}`}>Notifications</h4>
                            </div>

                            <div className={`${cardBg} ${borderColor} border rounded-xl ${hoverBg} transition-all duration-300`}>
                                <div className="flex justify-between items-center p-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${iconBg.email} rounded-xl flex items-center justify-center transition-colors duration-300`}>
                                            <FiMail className={`w-5 h-5 ${iconColor.email}`} />
                                        </div>
                                        <div>
                                            <p className={`font-medium ${textPrimary}`}>Email Notifications</p>
                                            <p className={`text-sm ${textSecondary}`}>Receive email updates about your finances</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleSetting('emailNotifications')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${toggleBg(preferences.emailNotifications)}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className={`${cardBg} ${borderColor} border rounded-xl ${hoverBg} transition-all duration-300`}>
                                <div className="flex justify-between items-center p-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${iconBg.push} rounded-xl flex items-center justify-center transition-colors duration-300`}>
                                            <FiBell className={`w-5 h-5 ${iconColor.push}`} />
                                        </div>
                                        <div>
                                            <p className={`font-medium ${textPrimary}`}>Push Notifications</p>
                                            <p className={`text-sm ${textSecondary}`}>Get real-time alerts on your device</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleSetting('pushNotifications')}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${toggleBg(preferences.pushNotifications)}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 ${preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Regional Settings */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                                <h4 className={`font-semibold ${textPrimary}`}>Regional Settings</h4>
                            </div>

                            <div className={`${cardBg} ${borderColor} border rounded-xl ${hoverBg} transition-all duration-300`}>
                                <div className="flex justify-between items-center p-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${iconBg.language} rounded-xl flex items-center justify-center transition-colors duration-300`}>
                                            <FiGlobe className={`w-5 h-5 ${iconColor.language}`} />
                                        </div>
                                        <div>
                                            <p className={`font-medium ${textPrimary}`}>Language</p>
                                            <p className={`text-sm ${textSecondary}`}>Choose your preferred language</p>
                                        </div>
                                    </div>
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                        className={`px-3 py-2 ${selectBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-300`}
                                    >
                                        <option value="en">🇺🇸 English</option>
                                        <option value="es">🇪🇸 Español</option>
                                        <option value="fr">🇫🇷 Français</option>
                                        <option value="de">🇩🇪 Deutsch</option>
                                        <option value="hi">🇮🇳 Hindi</option>
                                        <option value="ja">🇯🇵 日本語</option>
                                    </select>
                                </div>
                            </div>

                            <div className={`${cardBg} ${borderColor} border rounded-xl ${hoverBg} transition-all duration-300`}>
                                <div className="flex justify-between items-center p-5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 ${iconBg.date} rounded-xl flex items-center justify-center transition-colors duration-300`}>
                                            <FiCalendar className={`w-5 h-5 ${iconColor.date}`} />
                                        </div>
                                        <div>
                                            <p className={`font-medium ${textPrimary}`}>Date Format</p>
                                            <p className={`text-sm ${textSecondary}`}>How dates should be displayed</p>
                                        </div>
                                    </div>
                                    <select
                                        value={preferences.dateFormat}
                                        onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                                        className={`px-3 py-2 ${selectBg} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono transition-all duration-300`}
                                    >
                                        <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 ${borderColor} border-t">
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-sm"
                            >
                                {saveStatus === 'saved' ? (
                                    <>
                                        <FiCheck className="w-4 h-4" />
                                        Saved!
                                    </>
                                ) : (
                                    'Save Preferences'
                                )}
                            </button>
                            <button
                                onClick={handleReset}
                                className={`px-4 py-2.5 ${borderColor} border ${textSecondary} rounded-xl ${hoverBg} transition-all duration-200 font-medium`}
                            >
                                Reset
                            </button>
                        </div>

                        {/* Status Messages */}
                        {saveStatus === 'saved' && (
                            <div className={`${successBg} border rounded-lg p-3 animate-fadeIn transition-all duration-300`}>
                                <p className={`text-sm ${successText} text-center`}>✓ Preferences saved successfully!</p>
                            </div>
                        )}
                        {saveStatus === 'reset' && (
                            <div className={`${resetBg} border rounded-lg p-3 animate-fadeIn transition-all duration-300`}>
                                <p className={`text-sm ${resetText} text-center`}>✓ Preferences reset to default!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}