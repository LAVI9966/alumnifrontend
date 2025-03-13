"use client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";

const EventCardSkeleton = () => {
  return (
    <div className="bg-white p-4 max-w-[380px] shadow-lg rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-48 bg-gray-300 rounded"></div>

      {/* Title Skeleton */}
      <div className="mt-4 h-6 bg-gray-300 w-3/4 rounded"></div>

      {/* Date & Icon Skeleton */}
      <div className="mt-2 flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
      </div>

      {/* Description Skeleton */}
      <div className="mt-2 h-4 bg-gray-300 w-5/6 rounded"></div>

      {/* Button Skeleton */}
      <div className="mt-4 h-8 bg-gray-300 w-24 rounded"></div>
    </div>
  );
};

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
      console.log(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-[1200px] w-full mx-auto pt-8 px-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>

      {/* Show loading first before anything else */}
      {loading ? (
        <div>
          <div className="animate-pulse flex flex-col  gap-6">
            {/* Simulating grid items */}
            <div className="grid w-full mb-10 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <EventCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : allevents && allevents.length > 0 ? (
        <div className="flex w-full flex-wrap justify-start gap-6 mb-10">
          {allevents.map((event) => (
            <div
              key={event._id}
              className="bg-white p-4 w-full sm:max-w-[380px] shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <img
                src="/events/events.jfif"
                alt={event?.title}
                className="w-full h-48 object-cover"
              />
              <div className="pt-2">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col items-start text-[#797979] gap-1 text-sm">
                    <div className="mr-4 flex items-center gap-1">
                      <Icon icon="oui:token-date" width="20" height="20" />{" "}
                      {new Date(event.date).toISOString().split("T")[0]}
                    </div>
                  </div>
                  <button className="border border-[#C7A006] text-sm rounded-lg w-24 p-1">
                    Register
                  </button>
                </div>
                <p className="text-[#797979] text-sm">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No Event Available</p>
      )}
    </div>
  );
};

export default EventCards;
