'use client'
import React from 'react'

import { useTheme } from '@/context/ThemeProvider';
import CommitteeMembersTable from './CommitteeMembersTable';

const page = () => {
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    return (
        <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'}`} >
            <CommitteeMembersTable></CommitteeMembersTable>
        </div>
    )
}

export default page