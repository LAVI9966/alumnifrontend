"use client";
import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { Icon } from '@iconify/react';
import Link from 'next/link';

const PaymentSuccessPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'} transition-colors duration-200`}>
            <div className="container mx-auto px-4 py-16 max-w-2xl">
                <div className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} rounded-xl shadow-lg p-8 text-center`}>
                    <div className="mb-6">
                        <Icon
                            icon="mdi:check-circle"
                            className={`mx-auto ${isDark ? 'text-green-400' : 'text-green-500'}`}
                            width="80"
                            height="80"
                        />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
                    <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Thank you for your purchase. Your order has been placed successfully and is now pending.
                    </p>
                    <div className="space-y-4">
                        <Link
                            href="/alumni/orders"
                            className={`${isDark ? 'bg-white text-[#131A45] hover:bg-gray-200' : 'bg-[#131A45] text-white hover:bg-[#2A3057]'} block w-full py-3 rounded-lg font-medium transition-colors duration-200`}
                        >
                            View Orders
                        </Link>
                        <Link
                            href="/alumni/souvenir_shop"
                            className={`${isDark ? 'bg-[#1F2447] text-white hover:bg-[#2A3057]' : 'bg-gray-100 text-[#131A45] hover:bg-gray-200'} block w-full py-3 rounded-lg font-medium transition-colors duration-200`}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage; 