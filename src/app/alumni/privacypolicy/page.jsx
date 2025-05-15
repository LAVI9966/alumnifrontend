'use client'
import React, { useState } from 'react'
import { useTheme } from '@/context/ThemeProvider';

const PrivacyPolicy = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeSection, setActiveSection] = useState('introduction');

    // Handle section toggle
    const handleSectionClick = (sectionId) => {
        setActiveSection(activeSection === sectionId ? null : sectionId);
    }

    const sections = [
        {
            id: 'introduction',
            title: 'Introduction',
            content: 'This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.'
        },
        {
            id: 'data-collection',
            title: 'Data We Collect',
            content: 'We may collect personal information such as your name, email address, and usage data to improve our services and provide a better experience.'
        },
        {
            id: 'data-usage',
            title: 'How We Use Your Data',
            content: 'Your data helps us personalize your experience, improve our services, send important updates, and comply with legal requirements.'
        },
        {
            id: 'data-sharing',
            title: 'Data Sharing',
            content: 'We do not sell your personal information. We may share data with trusted partners who help us operate our services.'
        },
        {
            id: 'cookies',
            title: 'Cookies & Tracking',
            content: 'We use cookies and similar technologies to enhance your browsing experience and analyze site traffic.'
        },
        {
            id: 'rights',
            title: 'Your Rights',
            content: 'You have the right to access, correct, download, or request deletion of your personal information at any time.'
        },
        {
            id: 'security',
            title: 'Security Measures',
            content: 'We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.'
        },
        {
            id: 'changes',
            title: 'Changes to This Policy',
            content: 'We may update this Privacy Policy periodically. We will notify you of any material changes.'
        }
    ];

    return (
        <div className={`w-full min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-cyan-50 text-gray-800'} py-10 px-4 md:px-8 lg:px-16`}>
            <div className="max-w-4xl mx-auto">
                <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>Privacy Policy</h1>

                {/* Navigation/Table of Contents */}
                <div className={`mb-8 p-4 rounded-lg ${isDark ? 'bg-[#1A225A]' : 'bg-white'} shadow-md`}>
                    <h2 className="text-xl font-semibold mb-4">Contents</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sections.map(section => (
                            <li key={section.id}>
                                <button
                                    onClick={() => handleSectionClick(section.id)}
                                    className={`text-left px-3 py-2 rounded-md w-full transition ${activeSection === section.id
                                            ? (isDark ? 'bg-cyan-700 text-white' : 'bg-cyan-600 text-white')
                                            : (isDark ? 'hover:bg-[#242B6E]' : 'hover:bg-cyan-100')
                                        }`}
                                >
                                    {section.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Policy Sections */}
                <div className="space-y-4">
                    {sections.map(section => (
                        <div
                            key={section.id}
                            id={section.id}
                            className={`transition-all duration-300 overflow-hidden rounded-lg shadow-md ${isDark ? 'bg-[#1A225A]' : 'bg-white'
                                } ${activeSection === section.id ? 'max-h-96' : 'max-h-16'
                                }`}
                        >
                            <button
                                onClick={() => handleSectionClick(section.id)}
                                className="w-full text-left p-4 flex justify-between items-center font-medium"
                            >
                                <span className={isDark ? 'text-cyan-300' : 'text-cyan-700'}>
                                    {section.title}
                                </span>
                                <span className="transform transition-transform">
                                    {activeSection === section.id ? '↑' : '↓'}
                                </span>
                            </button>
                            <div className={`px-4 pb-4 ${activeSection === section.id ? 'block' : 'hidden'}`}>
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Last Updated */}
                <div className="mt-10 text-center text-sm opacity-80">
                    Last updated: May 15, 2025
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy