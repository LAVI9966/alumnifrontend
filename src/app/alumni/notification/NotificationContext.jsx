'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import gettoken from "@/app/function/gettoken";

// Create the context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const url = process.env.NEXT_PUBLIC_URL;

    // Function to fetch notification count
    const fetchNotificationCount = async () => {
        try {
            const token = await gettoken();

            const response = await fetch(`${url}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();

                if (data.user && Array.isArray(data.user.events)) {
                    setNotificationCount(data.user.events.length);
                } else if (data.user && Array.isArray(data.user.notifications)) {
                    setNotificationCount(data.user.notifications.length);
                }
            } else {
                console.error("Error fetching user data:", await response.text());
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchNotificationCount();

        // Set up a refresh interval (optional)
        const intervalId = setInterval(fetchNotificationCount, 60000); // Refresh every minute
        return () => clearInterval(intervalId);
    }, []);

    // Function to decrease notification count
    const decrementNotificationCount = () => {
        setNotificationCount(prev => Math.max(0, prev - 1));
    };

    return (
        <NotificationContext.Provider
            value={{
                notificationCount,
                setNotificationCount,
                fetchNotificationCount,
                decrementNotificationCount
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook for using the notification context
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};