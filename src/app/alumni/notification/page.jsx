'use client';

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import gettoken from "@/app/function/gettoken";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useNotifications } from "./NotificationContext";
import { useTheme } from "@/context/ThemeProvider";
const page = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const { decrementNotificationCount } = useNotifications();

  useEffect(() => {
    fetchUserEvents();
  }, [url]);

  const fetchUserEvents = async () => {
    try {
      // Get auth token
      const token = await gettoken();

      // Use the new user-events endpoint
      const response = await fetch(`${url}/api/events/user-events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      console.log("API Response (User Events):", data);

      // Sort events by date (newest first)
      const sortedEvents = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDismissEvent = async (eventId) => {
    try {
      const token = await gettoken();

      const response = await fetch(`${url}/api/events/user-events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to dismiss event');
      }

      // Remove the event from the local state
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      // Decrement the notification count in the header
      decrementNotificationCount();
      toast.success("Event dismissed");
    } catch (error) {
      console.error("Error dismissing event:", error);
      toast.error("Failed to dismiss event. Please try again.");
    }
  };

  const handleEventClick = (eventId) => {
    // Redirect to event details page
    router.push(`/alumni/events`);
  };
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';

  return (
    <div className={`mb-4 p-4 relative ${isDark ? 'bg-[#131A45]' : 'bg-white'} shadow-md rounded-lg`}>
      <div className="min-h-screen  pt-8 px-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Notifications</h2>
          <div className="flex flex-col gap-3 ">
            {loading ? (
              <p>Loading events...</p>
            ) : events.length === 0 ? (
              <p>No notifications at this time.</p>
            ) : (
              events.map((event) => {
                return (
                  <div key={event._id}>
                    <div className="flex justify-between py-2">
                      <div
                        className="cursor-pointer flex-grow"
                        onClick={() => handleEventClick(event._id)}
                      >
                        <p className="  font-semibold max-w-md">
                          {event.title}
                        </p>
                        <p className="text-[#717171] text-xs">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Icon
                        icon="basil:cross-solid"
                        width="24"
                        height="24"
                        className="cursor-pointer"
                        onClick={() => handleDismissEvent(event._id)}
                      />
                    </div>
                    <hr className="bg-gray-300 mt-1 h-[2px]" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div></div>
  );
};

export default page;