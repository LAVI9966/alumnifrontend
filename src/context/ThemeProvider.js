"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
    // Check if the user has a stored preference
    const [theme, setTheme] = useState('light'); // Default to light

    // Initialize theme from localStorage on component mount
    useEffect(() => {
        const storedTheme = localStorage.getItem('color-theme');

        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            // Check system preference if no stored preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setTheme('dark');
            }
        }

        // Add theme class to document root
        updateThemeClass('light', theme);
    }, []);

    // Update theme class when theme changes
    useEffect(() => {
        if (theme) {
            // Update localStorage
            localStorage.setItem('color-theme', theme);

            // Update theme class
            updateThemeClass(theme === 'dark' ? 'light' : 'dark', theme);
        }
    }, [theme]);

    // Helper to update the document classes
    const updateThemeClass = (removeClass, addClass) => {
        document.documentElement.classList.remove(removeClass);
        document.documentElement.classList.add(addClass);
    };

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
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
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};