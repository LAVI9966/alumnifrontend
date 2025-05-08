"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTheme } from "../context/ThemeProvider";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set up scroll event listener
    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top smooth function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl ${isDark
                        ? "bg-white text-[#131A45] hover:bg-gray-100"
                        : "bg-[#131A45] text-white hover:bg-[#0F1536]"
                        }`}
                    aria-label="Scroll to top"
                >
                    <Icon
                        icon="mdi:arrow-up"
                        width="24"
                        height="24"
                        className="animate-pulse"
                    />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;