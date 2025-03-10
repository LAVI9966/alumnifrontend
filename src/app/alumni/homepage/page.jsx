import Alumnihomepagecard from "@/components/homepage/alumnihomepagecard";
import Createpostdialogue from "@/components/homepage/createpostdialogue";
import Eventcard from "@/components/homepage/eventcard";
import Postcard from "@/components/homepage/postcard";
import Upcommingevent from "@/components/homepage/upcommingevent";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen max-w-[1200px] mx-auto w-full  pt-4 px-4 md:p-2 flex flex-col md:flex-row gap-0 md:gap-8 mt-2">
      {/* Upcoming Events Section */}
      <div className="w-full flex flex-col  gap-4 md:w-[31%]">
        <Upcommingevent />
        <div className=" hidden md:flex flex-col  gap-4 ">
          <Alumnihomepagecard
            title="Alumni Directory"
            desc="Search and connect with alumni from different batches and locations."
            targetlink="/alumni/members"
            buttonname="Explore"
          />
          <Alumnihomepagecard
            title="Upcoming Events"
            desc="Stay informed about reunions, webinars, and other alumni gatherings."
            targetlink="/alumni/events"
            buttonname="View Events"
          />
          <Alumnihomepagecard
            title="Career Opportunities"
            desc="Discover job postings and mentorship programs shared by alumni."
            targetlink="#"
            buttonname="Find Opportunities"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse gap-8 w-full md:w-[69%]">
        {/* Create Post Button */}
        <div className="mt-3 md:mt-0 w-full md:w-[18%]">
          <Createpostdialogue/>
         
        </div>
        {/* Post Card */}
        <div className="flex  w-full md:w-[82%] flex-col gap-2  mb-8">
          <Postcard />
          <Postcard />
        </div>
      </div>
    </div>
  );
};

export default page;
