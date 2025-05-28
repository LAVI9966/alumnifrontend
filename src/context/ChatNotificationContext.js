// ChatNotificationContext.js
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("ws://localhost:8000");
// const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL);
const ChatNotificationContext = createContext();

export const ChatNotificationProvider = ({ children }) => {
    // Load initial state from localStorage
    const [unreadObj, setUnreadObj] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('chatUnreadCounts');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });
    const [globalUnreadCount, setGlobalUnreadCount] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('globalUnreadCount');
            return saved ? parseInt(saved) : 0;
        }
        return 0;
    });

    // Total unread member count (number of unique members who sent messages)
    const unreadMemberCount = Object.keys(unreadObj).length;

    // Save unread counts to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('chatUnreadCounts', JSON.stringify(unreadObj));
            localStorage.setItem('globalUnreadCount', globalUnreadCount.toString());
        }
    }, [unreadObj, globalUnreadCount]);

    useEffect(() => {
        // Join personal notification room after login
        const storedData = localStorage.getItem("alumni");
        if (storedData) {
            const { user } = JSON.parse(storedData);
            if (user?.id) {
                socket.emit('joinUserRoom', user.id);
            }
        }
    }, []);

    useEffect(() => {
        // Listen for new message notifications
        socket.on('newMessageNotification', (data) => {
            // data: { fromUserId }
            console.log('New message notification received:', data);
            if (data && data.fromUserId) {
                setUnreadObj(prev => ({
                    ...prev,
                    [data.fromUserId]: (prev[data.fromUserId] || 0) + 1
                }));
            }
        });

        // Listen for global chat notifications
        socket.on('newGlobalMessageNotification', () => {
            setGlobalUnreadCount(prev => prev + 1);
        });

        return () => {
            socket.off('newMessageNotification');
            socket.off('newGlobalMessageNotification');
        };
    }, []);

    // Mark messages as read for a user
    const markAsRead = (userId) => {
        setUnreadObj(prev => {
            const updated = { ...prev };
            delete updated[userId];
            return updated;
        });
    };

    // Mark global chat as read
    const markGlobalAsRead = () => {
        setGlobalUnreadCount(0);
    };

    // Get total unread count across all chats
    const getTotalUnreadCount = () => {
        const personalUnreadCount = Object.values(unreadObj).reduce((sum, count) => sum + count, 0);
        return personalUnreadCount + globalUnreadCount;
    };

    return (
        <ChatNotificationContext.Provider value={{
            unreadObj,
            unreadCount: unreadMemberCount,
            globalUnreadCount,
            totalUnreadCount: getTotalUnreadCount(),
            setUnreadObj,
            markAsRead,
            markGlobalAsRead
        }}>
            {children}
        </ChatNotificationContext.Provider>
    );
};

export const useChatNotifications = () => useContext(ChatNotificationContext);
