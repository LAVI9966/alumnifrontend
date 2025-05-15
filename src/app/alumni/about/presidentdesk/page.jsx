'use client'
import React from 'react'

import { useTheme } from '@/context/ThemeProvider';
import PresidentDesk from './PresidentDesk';
const page = () => {
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    return (
        <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-cyan-400'}`} >
            <PresidentDesk></PresidentDesk>
        </div>
    )
}

export default page