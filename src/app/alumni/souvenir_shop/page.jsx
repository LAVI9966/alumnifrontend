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
            className={`w-full ${isDark ? 'bg-[#232B4A] text-white' : 'bg-custom-blue text-white'}`}
        >
            <h1 style={{ fontSize: "2.5rem", color: "#333" }}>Coming Soon</h1>
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