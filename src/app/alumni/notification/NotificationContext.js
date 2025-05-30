'use client';

import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationCount, setCount] = useState(0);

    useEffect(() => {
        // Fetch notification count from backend
        const fetchCount = async () => {
            try {
                const url = process.env.NEXT_PUBLIC_URL;
                const token = localStorage.getItem("alumni") ? JSON.parse(localStorage.getItem("alumni")).token : null;
                if (!token) return;
                const response = await fetch(`${url}/api/notifications`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const unread = data.filter(n => !n.isRead).length;
                    setCount(unread);
                }
            } catch (e) {
                console.error('Error fetching notifications:', e);
            }
        };
        fetchCount();
    }, []);

    return (
        <NotificationContext.Provider value={{ notificationCount, setCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
