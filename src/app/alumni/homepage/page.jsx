"use client";
import gettoken from "@/app/function/gettoken";
import Alumnihomepagecard from "@/components/homepage/alumnihomepagecard";
import Createpostdialogue from "@/components/homepage/createpostdialogue";
import Eventcard from "@/components/homepage/eventcard";
import Postcard from "@/components/homepage/postcard";
import Upcommingevent from "@/components/homepage/upcommingevent";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const [allposts, setAllposts] = useState([]);
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    getPosts();
  }, []);
  const getPosts = async () => {
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAllposts(data);
        console.log(data);
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };
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
          <Createpostdialogue />
        </div>
        {/* Post Card */}
        <div className="flex  w-full md:w-[82%] flex-col gap-2  mb-8">
          {allposts.map((val) => (
            <div key={val._id}>
              <Postcard postData={val} />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default page;
