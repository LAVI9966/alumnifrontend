'use client'
import React from 'react'

import { useTheme } from '@/context/ThemeProvider';
import ManagementCommitee from './ManagementCommite';


const page = () => {
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    return (
        <div className={`w-full pt-5 ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'}`} >
            <ManagementCommitee></ManagementCommitee>
        </div>
    )
}

export default page