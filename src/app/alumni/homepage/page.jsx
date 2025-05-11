"use client";
import gettoken from "@/app/function/gettoken";
import Alumnihomepagecard from "@/components/homepage/alumnihomepagecard";
import Createpostdialogue from "@/components/homepage/createpostdialogue";
import Eventcard from "@/components/homepage/eventcard";
import EventCardSkeleton from "@/components/homepage/eventCardSkeleton";
import Postcard from "@/components/homepage/postcard";
import Upcommingevent from "@/components/homepage/upcommingevent";
import { useTheme } from '../../../context/ThemeProvider'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [allposts, setAllposts] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [user, setUser] = React.useState(null);
  const url = process.env.NEXT_PUBLIC_URL;
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("alumni");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setUser(parsedData.user);
        } catch (error) {
          console.error("Error parsing localStorage data:", error);
        }
      }
    }
  }, []);
  useEffect(() => {
    getPosts();
  }, []);
  const getPosts = async () => {
    setIsloading(true);
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
        setIsloading(false);
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
      setIsloading(false);
    }
  };
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  return (
    <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-cyan-400'}`} >
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

          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-8 w-full md:w-[69%]">
          {/* Create Post Button */}
          <div className="mt-3 md:mt-0 w-full md:w-[18%]">
            <Createpostdialogue getPosts={getPosts} />
          </div>
          {/* Post Card */}
          <div className="flex  w-full md:w-[82%] flex-col gap-2  mb-8">
            {isloading ? (
              <div>
                <div className="animate-pulse flex flex-col  gap-6">
                  {/* Simulating grid items */}
                  <div className="grid w-full mb-10  gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i}>
                        <EventCardSkeleton />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              allposts.map((val) => (
                <div key={val._id}>
                  <Postcard postData={val} getPosts={getPosts} userid={user?.id} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default page;
