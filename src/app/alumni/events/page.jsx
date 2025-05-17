// Updated EventCards.jsx with toggling registration buttons and professional flow
"use client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";
import EventCardSkeleton from "../../../components/homepage/eventCardSkeleton.jsx";
import Link from "next/link.js";
import { useTheme } from "@/context/ThemeProvider.js";
import EventShareButton from "./EventShareButton.jsx";
import EventShareModal from "./EventShareModal.jsx";

const EventCards = () => {
  const [allevents, setallEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRegistrations, setUserRegistrations] = useState({});
  const [processingEventId, setProcessingEventId] = useState(null);
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();

  useEffect(() => {
    getEvent();
    getUserRegistrations();
  }, []);

  // Fetch all events
  const getEvent = async () => {
    setLoading(true);
    try {
      const token = await gettoken();
      if (!token) {
        toast.error("Authentication failed. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${url}/api/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setallEvents(data);
      } else {
        toast.error(data?.message || "Failed to load events.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get user's registrations to know which events they're registered for
  const getUserRegistrations = async () => {
    try {
      const token = await gettoken();
      if (!token) return;

      const response = await fetch(`${url}/api/events/my-registrations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Create a map of event IDs to registration IDs
        const registrationsMap = {};
        if (data && data.registrations && Array.isArray(data.registrations)) {
          data.registrations.forEach(reg => {
            if (reg && reg.event) {
              const eventId = typeof reg.event === 'object' ? reg.event._id : reg.event;
              registrationsMap[eventId] = reg._id;
            }
          });
        }

        setUserRegistrations(registrationsMap);
        console.log("User registered events:", registrationsMap);
      }
    } catch (error) {
      console.error("Error fetching user registrations:", error);
    }
  };

  // Check if user is registered for an event
  const isRegisteredForEvent = (eventId) => {
    return !!userRegistrations[eventId];
  };

  // Handle registration
  const handleRegister = async (eventId) => {
    // Prevent multiple clicks
    if (processingEventId) return;

    setProcessingEventId(eventId);

    try {
      const token = await gettoken();
      if (!token) {
        toast.error("Authentication failed. Please log in again.");
        setProcessingEventId(null);
        return;
      }

      const loadingToast = toast.loading("Processing registration...");

      const response = await fetch(`${url}/api/events/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventIds: [eventId] }),
      });

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success(data?.message || "Registration successful!");

        // Update local state to show registered status immediately
        setUserRegistrations(prev => ({
          ...prev,
          [eventId]: 'temp-id' // Temporary ID until we refresh
        }));

        // Refresh registrations to get the actual registration ID
        getUserRegistrations();
      } else {
        toast.error(data?.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error registering event:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setProcessingEventId(null);
    }
  };

  // Handle canceling registration
  const handleCancelRegistration = async (eventId) => {
    // Get registration ID
    const registrationId = userRegistrations[eventId];
    if (!registrationId) {
      toast.error("Registration information not found. Please refresh the page.");
      return;
    }

    // Prevent multiple clicks
    if (processingEventId) return;

    setProcessingEventId(eventId);

    try {
      const token = await gettoken();
      if (!token) {
        toast.error("Authentication failed. Please log in again.");
        setProcessingEventId(null);
        return;
      }

      const loadingToast = toast.loading("Canceling registration...");

      const response = await fetch(`${url}/api/events/my-registrations/${registrationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingToast);
      const data = await response.json();

      if (response.ok) {
        toast.success(data?.message || "Registration canceled successfully!");

        // Update local state to reflect changes immediately
        const updatedRegistrations = { ...userRegistrations };
        delete updatedRegistrations[eventId];
        setUserRegistrations(updatedRegistrations);
      } else {
        toast.error(data?.message || "Failed to cancel registration.");
      }
    } catch (error) {
      console.error("Error canceling registration:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setProcessingEventId(null);
    }
  };

  const handleViewDetails = (eventId) => {
    router.push(`/alumni/events/${eventId}`);
  };

  const handleShareClick = (event) => {
    setSelectedEvent(event);
    setShowShareModal(true);
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-cyan-400'}`} >
      <div className="min-h-screen max-w-[1200px] w-full mx-auto pt-8 px-4 sm:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
          <Link
            href="registeredevent"
            className={`px-4 py-2 flex justify-center items-center ${isDark ? 'bg-[#2A3057]' : 'bg-custom-blue'} text-white rounded-lg shadow-md transition`}
          >
            Registered Events
          </Link>
        </div>

        {/* Show loading first before anything else */}
        {loading ? (
          <div>
            <div className="animate-pulse flex flex-col gap-6">
              {/* Simulating grid items */}
              <div className="grid w-full mb-10 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="max-w-[380px]">
                    <EventCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : allevents && allevents.length > 0 ? (
          <div className="grid w-full md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {allevents.map((event) => {
              const isRegistered = isRegisteredForEvent(event._id);
              const isProcessing = processingEventId === event._id;

              return (
                <div
                  key={event._id}
                  className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} p-4 w-full md:max-w-[380px] shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 relative`}
                >
                  {/* Registration Badge */}
                  {isRegistered && (
                    <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Registered
                    </div>
                  )}

                  {/* Event Image - Clickable to view details */}
                  <div
                    className="w-full h-48 overflow-hidden cursor-pointer"
                    onClick={() => handleViewDetails(event._id)}
                  >
                    <img
                      src={
                        event?.imageUrl
                          ? `${url}/uploads/${event?.imageUrl?.split("\\").pop()}`
                          : "/events/events.jfif"
                      }
                      alt={event?.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>

                  <div className="pt-2">
                    {/* Event Title - Clickable to view details */}
                    <h3
                      className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 cursor-pointer hover:underline`}
                      onClick={() => handleViewDetails(event._id)}
                    >
                      {event.title}
                    </h3>

                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col items-start gap-1 text-sm">
                        <div className="mr-4 flex items-center gap-1">
                          <Icon icon="oui:token-date" width="20" height="20" className={isDark ? 'text-white' : 'text-gray-700'} />{" "}
                          <span className={isDark ? 'text-white' : 'text-gray-700'}>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons row */}
                      <div className="flex gap-2">
                        {/* Share Button */}
                        <EventShareButton eventData={event} />
                      </div>
                    </div>

                    {/* Event Description */}
                    <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {event.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-3">
                      {/* View Details Button */}
                      <button
                        onClick={() => handleViewDetails(event._id)}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Details
                        <Icon icon="mdi:arrow-right" width="16" height="16" />
                      </button>

                      {/* Register/Unregister Button */}
                      {isRegistered ? (
                        <button
                          onClick={() => handleCancelRegistration(event._id)}
                          className="border border-red-500 text-red-500 text-sm rounded-lg px-3 py-1 hover:bg-red-500 hover:text-white transition-colors"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-1">
                              <Icon icon="mdi:loading" className="animate-spin" width="16" height="16" />
                              Processing
                            </span>
                          ) : "Unregister"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegister(event._id)}
                          className="border border-[#C7A006] text-sm rounded-lg px-3 py-1 hover:bg-[#C7A006] hover:text-white transition-colors"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-1">
                              <Icon icon="mdi:loading" className="animate-spin" width="16" height="16" />
                              Processing
                            </span>
                          ) : "Register"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`text-center p-8 ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md`}>
            <Icon icon="mdi:calendar-blank" className="mx-auto mb-4" width="48" height="48" />
            <p className="text-lg font-semibold">No Events Available</p>
            <p className="text-sm mt-2">Check back later for upcoming events.</p>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && selectedEvent && (
        <EventShareModal
          eventData={selectedEvent}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default EventCards;