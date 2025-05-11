"use client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";
import EventCardSkeleton from "../../../components/homepage/eventCardSkeleton.jsx";
import Link from "next/link.js";
import { useTheme } from "@/context/ThemeProvider.js";
const EventCards = () => {
  const [allevents, setallEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    getEvent();
  }, []);
  const getEvent = async () => {
    setLoading(true);
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);

        setallEvents(data);
      } else {
        toast.error(data?.message || "failed.");
        setLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };
  const handleRegister = async (eventid) => {
    try {
      const token = await gettoken();
      if (!token) {
        toast.error("Authentication failed. Please log in again.");
        return;
      }

      const response = await fetch(`${url}/api/events/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
        body: JSON.stringify({ eventIds: [eventid] }), // Ensure body is a string
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data?.message || "Registration successful!");
      } else {
        toast.error(data?.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error registering event:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  return (
    <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-cyan-400'}`} >
      <div className="min-h-screen max-w-[1200px] w-full mx-auto pt-8 px-4 sm:p-8">
        <div
          className="flex flex-col mb-2
      "
        >
          <h2 className="text-2xl font-bold mb-2">Upcoming Events</h2>
          <div className="flex justify-end">
            <Link
              href="registeredevent"
              className="px-4 py-2 flex justify-center items-center bg-custom-blue text-white rounded-lg shadow-md hover:bg-black transition"
            >
              Registered Event
            </Link>
          </div>
        </div>

        {/* Show loading first before anything else */}
        {loading ? (
          <div>
            <div className="animate-pulse flex flex-col  gap-6">
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
          <div className="grid w-full md:grid-cols-2 lg:grid-cols-3  gap-6 mb-10">
            {allevents.map((event) => (
              <div
                key={event._id}
                className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'}  p-4 w-full md:max-w-[380px] shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300`}
              >
                <img
                  src={
                    event?.imageUrl
                      ? `${url}/uploads/${event?.imageUrl?.split("\\").pop()}`
                      : "/events/events.jfif"
                  }
                  alt={event?.title}
                  className="w-full h-48 object-cover"
                />
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col items-start gap-1 text-sm">
                      <div className="mr-4 flex items-center gap-1">
                        <Icon icon="oui:token-date" width="20" height="20" />{" "}
                        {new Date(event.date).toISOString().split("T")[0]}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRegister(event?._id)}
                      className="border border-[#C7A006] text-sm rounded-lg w-24 p-1"
                    >
                      Register
                    </button>
                  </div>
                  <p className=" text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No Event Available</p>
        )}
      </div>
    </div >
  );
};

export default EventCards;
