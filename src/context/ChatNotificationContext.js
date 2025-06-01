// ChatNotificationContext.js
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { usePathname } from 'next/navigation';

const ChatNotificationContext = createContext();

export const ChatNotificationProvider = ({ children }) => {
    const [unreadObj, setUnreadObj] = useState({});
    const [globalUnreadCount, setGlobalUnreadCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const pathname = usePathname();

    // Calculate total unread count
    const totalUnreadCount = Object.values(unreadObj).reduce((sum, count) => sum + count, 0) + globalUnreadCount;

    useEffect(() => {
        // Get user data and token from localStorage
        const userData = localStorage.getItem("alumni");
        if (!userData) return;

        const { token } = JSON.parse(userData);
        if (!token) return;

        // Initialize socket connection with auth token
        const newSocket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "ws://localhost:8000", {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            // Add autoConnect option to prevent immediate connection
            autoConnect: false
        });

        // Only connect if we're not on a public route
        const publicRoutes = ['/login', '/signup', '/', '/verification'];
        if (!publicRoutes.includes(pathname)) {
            newSocket.connect();
        }

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setIsConnected(true);
            const { user } = JSON.parse(userData);
            // Join user's personal room for notifications
            newSocket.emit('joinUserRoom', user.id);
            // Join global room
            newSocket.emit('joinGlobalRoom');
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        setSocket(newSocket);

        return () => {
            if (newSocket.connected) {
                newSocket.disconnect();
            }
        };
    }, [pathname]);

    useEffect(() => {
        if (!socket || !isConnected) return;

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
                    setUnreadObj(data.unreadCounts || {});
                    setGlobalUnreadCount(data.globalUnreadCount || 0);
                }
            } catch (e) {
                console.error('Error fetching unread chat count:', e);
            }
        };

        fetchUnreadCount();

        // Listen for new messages
        socket.on('newMessageNotification', (data) => {
            if (data.fromUserId) {
                setUnreadObj(prev => ({
                    ...prev,
                    [data.fromUserId]: (prev[data.fromUserId] || 0) + 1
                }));
            }
        });

        // Listen for global messages
        socket.on('newGlobalMessage', () => {
            setGlobalUnreadCount(prev => prev + 1);
        });

        // Listen for unread counts updates
        socket.on('unreadCountsUpdated', (counts) => {
            setUnreadObj(counts);
        });

        return () => {
            socket.off('newMessageNotification');
            socket.off('newGlobalMessage');
            socket.off('unreadCountsUpdated');
        };
    }, [socket, isConnected]);

    const markAsRead = (userId) => {
        if (socket && isConnected) {
            socket.emit('markAsRead', { userId });
        }
        setUnreadObj(prev => ({
            ...prev,
            [userId]: 0
        }));
    };

    const markGlobalAsRead = () => {
        if (socket && isConnected) {
            socket.emit('markGlobalAsRead');
        }
        setGlobalUnreadCount(0);
    };

    return (
        <ChatNotificationContext.Provider value={{
            unreadObj,
            markAsRead,
            globalUnreadCount,
            markGlobalAsRead,
            socket,
            isConnected,
            totalUnreadCount
        }}>
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
