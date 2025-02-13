import Eventcard from "@/components/homepage/eventcard";
import Postcard from "@/components/homepage/postcard";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto w-full  pt-4 px-4 sm:p-2 flex flex-col sm:flex-row gap-0 sm:gap-4">
      {/* Upcoming Events Section */}
      <div className="w-full sm:w-[25%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Upcoming Events</h2>
          <Link href="/alumni/events" className="text-sm text-gray-500">
            See All
          </Link>
        </div>
        <div className="overflow-hidden w-full">
          <div
            className="flex overflow-x-auto scrollbar-hide space-x-4  overflow-hidden"
            style={{ whiteSpace: "nowrap" }}
          >
            <div className="lg:flex-none">
              <Eventcard />{" "}
            </div>
            <div className="lg:flex-none">
              <Eventcard />{" "}
            </div>
            <div className="lg:flex-none">
              <Eventcard />{" "}
            </div>
          </div>
        </div>
      </div>
      {/* Create Post Button */}
      <div className="w-full sm:w-[25%]">
        <button className="w-full  bg-gray-900 text-white py-2 rounded-lg mt-4 ">
          Create Post
        </button>
      </div>
      {/* Post Card */}
      <div className="flex  w-full sm:w-[50%] flex-col gap-2 mt-4 mb-8">
        <Postcard />
        <Postcard />
      </div>
    </div>
  );
};

export default page;
