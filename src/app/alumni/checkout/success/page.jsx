"use client";
import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { Icon } from '@iconify/react';
import Link from 'next/link';

const SuccessPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto`}>
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon icon="mdi:check-circle" className="text-green-500" width="48" height="48" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>

                    <p className={`mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Thank you for your purchase. Your order has been received and will be processed shortly.
                        You will receive an email confirmation with your order details.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/alumni/souvenir_shop"
                            className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center`}
                        >
                            <Icon icon="mdi:shopping" className="mr-2" width="20" height="20" />
                            Continue Shopping
                        </Link>

                        <div className="text-sm">
                            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                Have questions about your order?
                            </p>
                            <Link
                                href="/alumni/contact"
                                className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} font-medium`}
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage; 