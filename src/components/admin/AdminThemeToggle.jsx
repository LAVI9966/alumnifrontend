"use client";
import { useTheme } from "@/context/ThemeProvider";
import { Icon } from "@iconify/react";
import Link from "next/link";

const AdminThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    return (
        <>
            <Link href="/alumni/homepage" className={`flex items-center px-3 py-2 rounded-md border border-gray-300 shadow-sm transition-colors duration-200 ${isDark ? 'bg-[#2A3057] text-white hover:bg-[#232B4A]' : 'bg-white text-[#131A45] hover:bg-gray-100'}`}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>Go to User Side</Link>
            <button
                onClick={toggleTheme}
                className={`flex items-center px-3 py-2 rounded-md border border-gray-300 shadow-sm transition-colors duration-200 ${isDark ? 'bg-[#2A3057] text-white hover:bg-[#232B4A]' : 'bg-white text-[#131A45] hover:bg-gray-100'}`}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                style={{ minWidth: 44 }}
            >
                {isDark ? (
                    <>
                        <Icon icon="ph:sun" width="20" height="20" className="mr-2" /> Light Mode
                    </>
                ) : (
                    <>
                        <Icon icon="ph:moon" width="20" height="20" className="mr-2" /> Dark Mode
                    </>
                )}
            </button>
        </>
    );
};

export default AdminThemeToggle;
