"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const useDarkMode = () => {
    const pathname = usePathname();

    // Only apply the hook if route starts with "/alumni"
    const shouldApply = pathname.startsWith("/alumni");

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (!shouldApply) return; // Don't run anything

        // Example: read theme from localStorage
        const savedTheme = localStorage.getItem("theme");
        setIsDark(savedTheme === "light");

        // Optionally listen to system theme or other logic
    }, [shouldApply]);

    // Return null or your theme state depending on use case
    return shouldApply ? { isDark, setIsDark } : null;
};
