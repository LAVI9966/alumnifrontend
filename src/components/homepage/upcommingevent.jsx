"use client";
import React, { useEffect, useState } from "react";
import Eventcard from "./eventcard";
import Link from "next/link";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";

const Upcommingevent = () => {
  const [event, setallEvents] = useState([]);
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Upcoming Events</h2>
        <Link href="/alumni/events" className="text-md text-gray-500">
          See All
        </Link>
      </div>
      <div className="overflow-hidden w-full">
        <div
          className="flex  flex-row lg:flex-col gap-0 lg:gap-2 overflow-x-auto scrollbar-hide space-x-4 lg:space-x-0  overflow-hidden"
          style={{ whiteSpace: "nowrap" }}
        >
          {event.map((val) => (
            <div key={val._id} className="lg:flex-none">
              <Eventcard
                date={val.date}
                title={val.title}
                description={val.description}
              />{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upcommingevent;
