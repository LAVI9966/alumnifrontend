"use client"
import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
const ComingSoon = () => {
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    return (
        <div style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

        }}
            className={`w-full ${isDark ? 'bg-[#131A45] text-white' : 'bg-white text-[#131A45]'}`}
        >
            <h1 style={{ fontSize: "2.5rem" }}>Coming Soon</h1>
            <p style={{ color: "#666", marginTop: "1rem" }}>
                Our Souvenir Shop page is under construction. Stay tuned!
            </p>
        </div>
    );
};

const page = () => {
    return (
        <div>
            <ComingSoon></ComingSoon>
        </div>
    )
}
export default page