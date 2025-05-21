'use client'
import React from 'react'
import RobaHistory from './RobaHistory'
import { useTheme } from '@/context/ThemeProvider';
const page = () => {
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    return (
        <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'}`} >
            <RobaHistory></RobaHistory>
        </div>
    )
}

export default page