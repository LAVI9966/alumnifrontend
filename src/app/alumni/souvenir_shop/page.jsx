"use client"
import React from 'react'
import { useTheme } from '@/context/ThemeProvider';
import SouvenirShop from './SouvenirShop'
const ComingSoon = () => {
    return (
        <div style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

        }}
            className={`w-full bg-white text-[#131A45]`}
        >
            <h1 style={{ fontSize: "2.5rem" }}>Coming Soon</h1>
            <p style={{ color: "#666", marginTop: "1rem" }}>
                Our Souvenir Shop page is under construction. Stay tuned!
            </p>
        </div>
    );
};

const page = () => {
    const { theme, toggleTheme } = useTheme(); // Use the theme context
    const isDark = theme === 'dark';
    return (
        <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'}`} >
            <SouvenirShop></SouvenirShop>
        </div>
    )
}
export default page