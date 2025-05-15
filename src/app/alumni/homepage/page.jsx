"use client";
import gettoken from "@/app/function/gettoken";
import Alumnihomepagecard from "@/components/homepage/alumnihomepagecard";
import Createpostdialogue from "@/components/homepage/createpostdialogue";
import EventCardSkeleton from "@/components/homepage/eventCardSkeleton";
import Postcard from "@/components/homepage/postcard";
import Upcommingevent from "@/components/homepage/upcommingevent";
import WelcomeBanner from "@/components/homepage/WelcomeBanner"; // Import the new welcome banner component
import { useTheme } from '../../../context/ThemeProvider';
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Page = () => {
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
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAllposts(data);
        setIsloading(false);
      } else {
        toast.error(data?.message || "Failed to load posts.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
      setIsloading(false);
    }
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };
  return (
    <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-cyan-400'}`}>
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[429px] overflow-hidden">
        <Slider {...sliderSettings} className="slick-slider">
          <div className="h-[300px] md:h-[429px]">
            <Image
              src="/about/pic1.png"
              alt="Rimcollian Alumni Event"
              width={1920}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[300px] md:h-[429px]">
            <Image
              src="/about/pic2.png"
              alt="Rimcollian Alumni Event"
              width={1920}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[300px] md:h-[429px]">
            <Image
              src="/about/pic3.png"
              alt="Rimcollian Alumni Event"
              width={1920}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
        </Slider>
        {/* bg-gradient-to-b from-[#3271FF] to-[#131A45] */}
        {/* Overlay Content */}
        <div className="absolute  inset-0 text-white flex flex-col justify-center items-center bg-[#131A45] bg-opacity-50 text-center p-4">
          <h1 className="text-2xl md:text-4xl font-bold">


            {/* Welcome to Rimcollian Alumni Portal */}
            Welcome to ROBA portal
          </h1>
          <p className="mt-2">
            Explore your dashboard to stay connected with the alumni community.
          </p>
        </div>

        {/* Slider Dots Styling */}
        <style jsx global>{`
                 .slick-dots {
                   z-index: 50;
                   bottom: 10px;
                 }
                 .slick-dots li button:before {
                   color: white;
                 }
                 .slick-dots li.slick-active button:before {
                   color: #ffffff;
                 }
               `}</style>
      </section>

      <div className="min-h-screen max-w-[1200px] mx-auto w-full pt-4 px-4 md:p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-0 md:gap-8">
          {/* Upcoming Events Section */}
          <div className="w-full flex flex-col gap-4 md:w-[31%]">
            <Upcommingevent />
            <div className="hidden md:flex flex-col gap-4">
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
            {/* Post Cards */}
            <div className="flex w-full md:w-[82%] flex-col gap-2 mb-8">
              {isloading ? (
                <div>
                  <div className="animate-pulse flex flex-col gap-6">
                    <div className="grid w-full mb-10 gap-4">
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
      </div>
    </div>
  );
};

export default Page;