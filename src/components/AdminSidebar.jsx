"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUsers, FaBox, FaShoppingCart, FaCog } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeProvider';

const menuItems = [
    {
        title: 'Dashboard',
        icon: <FaHome />,
        path: '/admin'
    },
    {
        title: 'Users',
        icon: <FaUsers />,
        path: '/admin/users'
    },
    {
        title: 'Products',
        icon: <FaBox />,
        path: '/admin/products'
    },
    {
        title: 'Orders',
        icon: <FaShoppingCart />,
        path: '/admin/orders'
    },
    {
        title: 'Settings',
        icon: <FaCog />,
        path: '/admin/settings'
    }
];

const AdminSidebar = () => {
    const pathname = usePathname();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`h-screen w-64 fixed left-0 top-0 ${isDark ? 'bg-[#1F2447] text-white' : 'bg-white text-[#131A45]'} shadow-lg transition-colors duration-200`}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                                ? isDark
                                                    ? 'bg-[#3D437E] text-white'
                                                    : 'bg-[#131A45] text-white'
                                                : isDark
                                                    ? 'hover:bg-[#2A3057]'
                                                    : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default AdminSidebar; 