"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaUsers, FaBox, FaShoppingCart, FaCog, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeProvider';

const menuItems = [
    {
        title: 'Dashboard',
        icon: <FaHome />,
        path: '/admin'
    },
    {
        title: 'User Management',
        icon: <FaUsers />,
        submenu: [
            { title: 'All Users', path: '/admin/users' },
            { title: 'Add User', path: '/admin/users/add' },
            { title: 'User Roles', path: '/admin/users/roles' }
        ]
    },
    {
        title: 'Event Management',
        icon: <FaBox />,
        submenu: [
            { title: 'All Events', path: '/admin/events' },
            { title: 'Create Event', path: '/admin/events/create' },
            { title: 'Event Categories', path: '/admin/events/categories' }
        ]
    },
    {
        title: 'Order Management',
        icon: <FaShoppingCart />,
        submenu: [
            { title: 'All Orders', path: '/admin/orders' },
            { title: 'Pending Orders', path: '/admin/orders/pending' },
            { title: 'Completed Orders', path: '/admin/orders/completed' }
        ]
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
    const [openSubmenus, setOpenSubmenus] = useState({});

    const toggleSubmenu = (title) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    return (
        <div className={`h-screen w-64 fixed left-0 top-0 ${isDark ? 'bg-[#1F2447] text-white' : 'bg-white text-[#131A45]'} shadow-lg transition-colors duration-200`}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            const hasSubmenu = item.submenu;
                            const isSubmenuOpen = openSubmenus[item.title];

                            return (
                                <li key={item.title}>
                                    {hasSubmenu ? (
                                        <div>
                                            <button
                                                onClick={() => toggleSubmenu(item.title)}
                                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isDark
                                                    ? 'hover:bg-[#2A3057]'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{item.icon}</span>
                                                    <span>{item.title}</span>
                                                </div>
                                                {isSubmenuOpen ? <FaChevronDown /> : <FaChevronRight />}
                                            </button>
                                            {isSubmenuOpen && (
                                                <ul className="ml-8 mt-2 space-y-2">
                                                    {item.submenu.map((subItem) => {
                                                        const isSubActive = pathname === subItem.path;
                                                        return (
                                                            <li key={subItem.path}>
                                                                <Link
                                                                    href={subItem.path}
                                                                    className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${isSubActive
                                                                        ? isDark
                                                                            ? 'bg-[#3D437E] text-white'
                                                                            : 'bg-[#131A45] text-white'
                                                                        : isDark
                                                                            ? 'hover:bg-[#2A3057]'
                                                                            : 'hover:bg-gray-100'
                                                                        }`}
                                                                >
                                                                    {subItem.title}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    ) : (
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
                                    )}
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