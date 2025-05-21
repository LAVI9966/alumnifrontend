"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import gettoken from "@/app/function/gettoken";
import { Icon } from "@iconify/react";
import { useTheme } from '@/context/ThemeProvider';
import toast from 'react-hot-toast';
import EventShareButton from "../EventShareButton";
import EventShareModal from "../EventShareModal";

const EventDetailPage = () => {
    const { eventId } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationId, setRegistrationId] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const url = process.env.NEXT_PUBLIC_URL;

    // Fetch event data
    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) return;

            setIsLoading(true);
            try {
                // Try to get token
                const token = await gettoken();

                if (!token) {
                    console.log('No token available, showing login prompt');
                    setError('Please log in to view this event');
                    setIsLoading(false);
                    return;
                }

                // Fetch the event details
                const response = await fetch(`${url}/api/events/${eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Failed to fetch event: ${response.status}`);
                }

                const data = await response.json();
                console.log('Event data received:', data);
                setEvent(data);

                // Check if user is registered for this event
                try {
                    const registrationsResponse = await fetch(`${url}/api/events/my-registrations`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (registrationsResponse.ok) {
                        const registrationsData = await registrationsResponse.json();
                        console.log("User registrations:", registrationsData);

                        // Safely check registrations
                        if (registrationsData && registrationsData.registrations && Array.isArray(registrationsData.registrations)) {
                            const eventRegistration = registrationsData.registrations.find(
                                reg => reg && reg.event &&
                                    (typeof reg.event === 'object' ?
                                        reg.event._id === eventId :
                                        reg.event === eventId)
                            );

                            if (eventRegistration) {
                                console.log("User is registered for this event:", eventRegistration);
                                setIsRegistered(true);
                                setRegistrationId(eventRegistration._id);
                            } else {
                                console.log("User is not registered for this event");
                                setIsRegistered(false);
                            }
                        }
                    } else {
                        console.log("Failed to fetch registration status:", registrationsResponse.status);
                    }
                } catch (regError) {
                    // Don't fail the entire page load if registration check fails
                    console.error("Error checking registration status:", regError);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Failed to load the event. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, url]);

    // Handle event registration
    const handleRegister = async () => {
        try {
            const token = await gettoken();
            if (!token) {
                toast.error("Authentication failed. Please log in again.");
                return;
            }

            // Set loading state for button
            const loadingToast = toast.loading("Registering for event...");

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
                setIsRegistered(true);

                // Refresh registration status
                try {
                    const registrationsResponse = await fetch(`${url}/api/events/my-registrations`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (registrationsResponse.ok) {
                        const registrationsData = await registrationsResponse.json();
                        if (registrationsData && registrationsData.registrations) {
                            const eventRegistration = registrationsData.registrations.find(
                                reg => reg && reg.event &&
                                    (typeof reg.event === 'object' ?
                                        reg.event._id === eventId :
                                        reg.event === eventId)
                            );

                            if (eventRegistration) {
                                setRegistrationId(eventRegistration._id);
                            }
                        }
                    }
                } catch (regError) {
                    console.error("Error refreshing registration status:", regError);
                }
            } else {
                toast.error(data?.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Error registering event:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    // Handle canceling registration
    const handleCancelRegistration = async () => {
        if (!registrationId) {
            toast.error("Registration ID not found. Please refresh the page and try again.");
            return;
        }

        try {
            const token = await gettoken();
            if (!token) {
                toast.error("Authentication failed. Please log in again.");
                return;
            }

            // Set loading state for button
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
                setIsRegistered(false);
                setRegistrationId(null);
            } else {
                toast.error(data?.message || "Failed to cancel registration.");
            }
        } catch (error) {
            console.error("Error canceling registration:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    // Handle share click
    const handleShareClick = () => {
        setShowShareModal(true);
        // Optional: Track share action
        try {
            // You could add analytics tracking here if needed
            console.log("User initiated share for event:", eventId);
        } catch (error) {
            console.error("Error tracking share action:", error);
        }
    };

    // Display loading state
    if (isLoading) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'} py-8`}>
                <div className="max-w-2xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className={`h-64 rounded-t-lg ${isDark ? 'bg-[#2A3057]' : 'bg-gray-300'}`}></div>
                        <div className={`h-8 mt-4 rounded ${isDark ? 'bg-[#1F2447]' : 'bg-gray-200'} w-3/4`}></div>
                        <div className={`h-6 mt-2 rounded ${isDark ? 'bg-[#1F2447]' : 'bg-gray-200'} w-1/2`}></div>
                        <div className={`h-24 mt-4 rounded ${isDark ? 'bg-[#1F2447]' : 'bg-gray-200'}`}></div>
                        <div className={`h-10 mt-6 rounded ${isDark ? 'bg-[#1F2447]' : 'bg-gray-200'} w-1/3`}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Display error state with login option
    if (error) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'} py-8`}>
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className={`p-6 rounded-lg ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-gray-800'}`}>
                        <h1 className="text-xl font-bold mb-4">
                            {error}
                        </h1>
                        <p className="mb-4">
                            {error.includes('log in')
                                ? 'You need to be logged in to view this event.'
                                : 'There was an error loading this event.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {error.includes('log in') && (
                                <button
                                    onClick={() => router.push(`/login?redirect=${encodeURIComponent(`/alumni/events/${eventId}`)}`)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Log In
                                </button>
                            )}
                            <button
                                onClick={() => router.push('/alumni/events')}
                                className={`px-4 py-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'} rounded-lg`}
                            >
                                Return to Events
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Display event not found state
    if (!event) {
        return (
            <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'} py-8`}>
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <div className={`p-6 rounded-lg ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-gray-800'}`}>
                        <h1 className="text-xl font-bold mb-4">
                            Event not found
                        </h1>
                        <p className="mb-4">
                            The event you are looking for does not exist or has been removed.
                        </p>
                        <button
                            onClick={() => router.push('/alumni/events')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Return to Events
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Format date for display
    const formattedDate = event.date
        ? new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Date not specified';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'} py-8`}>
            <div className="max-w-4xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/alumni/events')}
                    className={`flex items-center gap-2 mb-4 px-3 py-1 rounded-lg ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-gray-800'}`}
                >
                    <Icon icon="mdi:arrow-left" width="20" height="20" />
                    <span>Back to Events</span>
                </button>

                {/* Event Card */}
                <div className={`${isDark ? 'bg-[#2A3057] text-white' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
                    {/* Event Image */}
                    <div className="relative w-full h-64 md:h-80">
                        <img
                            src={
                                event?.imageUrl
                                    ? `${url}/uploads/${event?.imageUrl?.split("\\").pop()}`
                                    : "/events/events.jfif"
                            }
                            alt={event?.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Event Details */}
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <h1 className="text-2xl font-bold mb-2">{event.title}</h1>

                            {/* Share Button */}
                            <div>
                                <EventShareButton
                                    eventData={event}
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm mb-4">
                            <Icon icon="mdi:calendar" width="20" height="20" className="text-[#C7A006]" />
                            <span>{formattedDate}</span>
                        </div>

                        {/* Description */}
                        <p className="mb-6 whitespace-pre-line">{event.description}</p>

                        {/* Registration Status */}
                        {isRegistered && (
                            <div className="flex items-center gap-2 p-2 mb-4 bg-green-100 text-green-800 rounded-md">
                                <Icon icon="mdi:check-circle" width="20" height="20" />
                                <span>You are registered for this event</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {isRegistered ? (
                                <button
                                    onClick={handleCancelRegistration}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Cancel Registration
                                </button>
                            ) : (
                                <button
                                    onClick={handleRegister}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Register for Event
                                </button>
                            )}

                            {/* <button
                                onClick={handleShareClick}
                                className="px-4 py-2 border border-[#C7A006] rounded-lg hover:bg-[#C7A006] hover:text-white transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon icon="mdi:share" width="20" height="20" />
                                    <span>Share Event</span>
                                </div>
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <EventShareModal
                    eventData={event}
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
};

export default EventDetailPage;