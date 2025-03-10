"use client";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";
const EventCards = () => {
  const [allevents, setallEvents] = useState([]);

  const url = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    getEvent();
  }, []);
  const getEvent = async () => {
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
        console.log(data);
        setallEvents(data);
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <div className="min-h-screen max-w-[1200px] w-full mx-auto  pt-8 px-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="flex w-full flex-wrap justify-start gap-6 mb-10">
        {allevents?.length > 0 ? (
          allevents?.map((event) => (
            <div
              key={event._id}
              className="bg-white p-4 max-w-[380px] shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
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
                  <div className="flex  flex-col items-start text-[#797979] gap-1 text-sm ">
                    <div className="mr-4 flex items-center gap-1">
                      <Icon icon="oui:token-date" width="20" height="20" />{" "}
                      {new Date(event.date).toISOString().split("T")[0]}
                    </div>
                    {/* <div className="mr-4 flex items-center gap-1">
                    <Icon
                      icon="mingcute:location-line"
                      width="20"
                      height="20"
                    />
                    {event.location}
                  </div> */}
                  </div>
                  <button className="border border-[#C7A006] text-sm rounded-lg w-24 p-1">
                    Register
                  </button>
                </div>
                <p className="text-[#797979] text-sm">{event.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No Event Available</p>
        )}
      </div>
    </div>
  );
};

export default EventCards;
