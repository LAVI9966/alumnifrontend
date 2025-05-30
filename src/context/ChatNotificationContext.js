// ChatNotificationContext.js
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useNotifications } from '../app/alumni/notification/NotificationContext';

// Use environment variable for WebSocket URL
const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "ws://localhost:8000");

const ChatNotificationContext = createContext();

export const ChatNotificationProvider = ({ children }) => {
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch unread chat messages count from backend
        const fetchUnreadCount = async () => {
            try {
                const url = process.env.NEXT_PUBLIC_URL;
                const token = localStorage.getItem("alumni") ? JSON.parse(localStorage.getItem("alumni")).token : null;
                if (!token) return;
                const response = await fetch(`${url}/api/chat/unread`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTotalUnreadCount(data.count || 0);
                }
            } catch (e) {
                console.error('Error fetching unread chat count:', e);
            }
        };
        fetchUnreadCount();
    }, []);

    const updateUnreadCount = (count) => {
        setTotalUnreadCount(count);
    };

    return (
        <ChatNotificationContext.Provider value={{ totalUnreadCount, updateUnreadCount }}>
            {children}
        </ChatNotificationContext.Provider>
    );
};

export const useChatNotifications = () => {
    const context = useContext(ChatNotificationContext);
    if (!context) {
        throw new Error('useChatNotifications must be used within a ChatNotificationProvider');
    }
    return context;
};
