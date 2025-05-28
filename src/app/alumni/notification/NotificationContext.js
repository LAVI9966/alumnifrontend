'use client';

import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationCount, setNotificationCount] = useState(0);

    const decrementNotificationCount = () => {
        setNotificationCount((prev) => Math.max(prev - 1, 0));
    };

    const setCount = (count) => setNotificationCount(count);

    return (
        <NotificationContext.Provider value={{ notificationCount, setCount, decrementNotificationCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
