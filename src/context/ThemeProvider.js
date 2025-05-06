"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // Default to light

    // On mount, check for stored theme
    // On mount, check for stored theme
    useEffect(() => {
        const storedTheme = localStorage.getItem('color-theme');

        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            setTheme('light'); // Force light on first load if nothing is stored
        }
    }, []);

    // Apply theme to document and localStorage
    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('color-theme', theme);
    }, [theme]);

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
