'use client';

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import gettoken from "@/app/function/gettoken";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useNotifications } from "./NotificationContext";
import { useTheme } from "@/context/ThemeProvider";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "ws://localhost:8000");

const page = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const { decrementNotificationCount, setCount } = useNotifications();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notification updates
    socket.on('newPostNotification', () => {
      fetchNotifications();
    });

    socket.on('newCommentNotification', () => {
      fetchNotifications();
    });

    socket.on('newShareNotification', () => {
      fetchNotifications();
    });

    socket.on('newEventNotification', () => {
      fetchNotifications();
    });

    return () => {
      socket.off('newPostNotification');
      socket.off('newCommentNotification');
      socket.off('newShareNotification');
      socket.off('newEventNotification');
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data);
      // Update notification count
      const unread = data.filter(n => !n.isRead).length;
      setCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDismissNotification = async (notificationId) => {
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      decrementNotificationCount();
      toast.success("Notification dismissed");
    } catch (error) {
      console.error("Error dismissing notification:", error);
      toast.error("Failed to dismiss notification. Please try again.");
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'event' && notification.event) {
      router.push(`/alumni/events/${notification.event._id || notification.event}`);
    } else if (notification.post) {
      router.push(`/alumni/posts/${notification.post}`);
    }
  };

  return (
    <div className={`mb-4 p-4 relative ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'} shadow-md rounded-lg`}>
      <div className="min-h-screen pt-8 px-4 sm:p-8">
        <div className={`max-w-3xl ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-xl mx-auto`}>
          <h2 className="text-3xl font-semibold mb-4">Notifications</h2>
          <div className="flex flex-col gap-3">
            {loading ? (
              <p>Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p>No notifications at this time.</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification._id}>
                  <div className="flex justify-between py-2">
                    <div
                      className="cursor-pointer flex-grow"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p className="font-semibold max-w-md">
                        {notification.type === 'event'
                          ? notification.message || (notification.event?.title ? `Event: ${notification.event.title}` : 'Event notification')
                          : `${notification.fromUser?.name || 'Someone'} ${notification.message}`}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-[#717171]'}`}>
                        {notification.type === 'event' && notification.event?.date
                          ? `${notification.type} • ${new Date(notification.event.date).toLocaleString()}`
                          : `${notification.type} • ${new Date(notification.createdAt).toLocaleString()}`}
                      </p>
                    </div>
                    <Icon
                      icon="basil:cross-solid"
                      width="24"
                      height="24"
                      className="cursor-pointer"
                      onClick={() => handleDismissNotification(notification._id)}
                    />
                  </div>
                  <hr className={`${isDark ? 'bg-gray-600' : 'bg-gray-300'} mt-1 h-[2px]`} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;