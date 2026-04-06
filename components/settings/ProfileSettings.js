"use client";

import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiDollarSign, FiSave, FiEdit2 } from 'react-icons/fi';

export default function ProfileSettings() {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        currency: 'USD',
        theme: 'light',
        notifications: true
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);
    const {isDark} = useTheme();

    const handleSave = () => {
        setProfile(formData);
        setIsEditing(false);
        localStorage.setItem('userProfile', JSON.stringify(formData));
    };

    // Dynamic classes based on theme
    const cardBg = isDark ? 'bg-gray-950' : 'bg-white';
    const borderColor = isDark ? 'border-gray-900' : 'border-gray-100';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-500';
    const textTertiary = isDark ? 'text-gray-500' : 'text-gray-600';
    const labelColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const profileCardBg = isDark ? 'bg-gray-950/50' : 'bg-gray-50';
    const inputBg = isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
    const selectBg = isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900';
    const editBtn = isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white';
    const saveBtn = isDark ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-green-500 hover:bg-green-600';

    return (
        <div className={`${cardBg} ${borderColor} border rounded-xl shadow-sm p-6`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-semibold ${textPrimary}`}>Profile Settings</h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className={`px-4 py-2 ${editBtn} rounded-lg flex items-center gap-2`}
                    >
                        <FiEdit2 className="w-4 h-4" /> Edit Profile
                    </button>
                ) : (
                    <button
                        onClick={handleSave}
                        className={`px-4 py-2 ${saveBtn} text-white rounded-lg flex items-center gap-2`}
                    >
                        <FiSave className="w-4 h-4" /> Save Changes
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 ${profileCardBg} rounded-lg`}>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <FiUser className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <p className={`font-semibold ${textPrimary}`}>{profile.name}</p>
                        <p className={`text-sm ${textSecondary}`}>{profile.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className={`block text-sm font-medium ${labelColor} mb-2`}>Full Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full px-3 py-2 ${inputBg} rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                placeholder="Enter your full name"
                            />
                        ) : (
                            <p className={`${textPrimary} font-medium`}>{profile.name}</p>
                        )}
                    </div>

                    {/* Email Address */}
                    <div>
                        <label className={`block text-sm font-medium ${labelColor} mb-2`}>Email Address</label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full px-3 py-2 ${inputBg} rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                                placeholder="Enter your email address"
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <FiMail className={`w-4 h-4 ${textSecondary}`} />
                                <span className={textPrimary}>{profile.email}</span>
                            </div>
                        )}
                    </div>

                    {/* Currency */}
                    <div>
                        <label className={`block text-sm font-medium ${labelColor} mb-2`}>Preferred Currency</label>
                        {isEditing ? (
                            <select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className={`w-full px-3 py-2 ${selectBg} rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                            >
                                <option value="USD">🇺🇸 USD - US Dollar</option>
                                <option value="EUR">🇪🇺 EUR - Euro</option>
                                <option value="GBP">🇬🇧 GBP - British Pound</option>
                                <option value="JPY">🇯🇵 JPY - Japanese Yen</option>
                                <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                                <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
                                <option value="INR">🇮🇳 INR - Indian Rupee</option>
                                <option value="CNY">🇨🇳 CNY - Chinese Yuan</option>
                                <option value="CHF">🇨🇭 CHF - Swiss Franc</option>
                            </select>
                        ) : (
                            <div className={`flex items-center gap-2 p-3 ${profileCardBg} rounded-lg`}>
                                <FiDollarSign className={`w-5 h-5 ${textSecondary}`} />
                                <span className={`font-medium ${textPrimary}`}>{profile.currency}</span>
                                <span className={`text-xs ${textTertiary} ml-2`}>
                                    {profile.currency === 'USD' && 'United States Dollar'}
                                    {profile.currency === 'EUR' && 'Euro'}
                                    {profile.currency === 'GBP' && 'British Pound'}
                                    {profile.currency === 'JPY' && 'Japanese Yen'}
                                    {profile.currency === 'CAD' && 'Canadian Dollar'}
                                    {profile.currency === 'AUD' && 'Australian Dollar'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Account Stats - Additional Info */}
                    <div className={`pt-4 mt-4 ${borderColor} border-t`}>
                        <h4 className={`text-sm font-medium ${labelColor} mb-3`}>Account Information</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className={`p-3 ${profileCardBg} rounded-lg`}>
                                <p className={`text-xs ${textTertiary} mb-1`}>Member Since</p>
                                <p className={`text-sm font-medium ${textPrimary}`}>January 2024</p>
                            </div>
                            <div className={`p-3 ${profileCardBg} rounded-lg`}>
                                <p className={`text-xs ${textTertiary} mb-1`}>Account Status</p>
                                <p className="text-sm font-medium text-green-500">● Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}