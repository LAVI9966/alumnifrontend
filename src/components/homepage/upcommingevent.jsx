import React from "react";
import Eventcard from "./eventcard";
import Link from "next/link";

const Upcommingevent = () => {
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
          <div className="lg:flex-none">
            <Eventcard />{" "}
          </div>
          <div className="lg:flex-none">
            <Eventcard />{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upcommingevent;
