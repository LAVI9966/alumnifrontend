"use client";
import Image from "next/image";
import Slider from "react-slick";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "@/components/footer";
const aboutDetails = [
  {
    title: "About This Portal",
    description: "A space for Rimcollians to stay connected and engaged.",
  },
  {
    title: "Keeping the Bond Alive",
    description:
      "We understand that the bonds formed during your time at school are special. This portal is a way to keep those relationships alive and meaningful, regardless of where life has taken you.",
  },
  {
    title: "How to Contribute",
    description:
      "Your involvement keeps the spirit of this community strong. Share updates, participate in events, or mentor current students and younger alumni. Every contribution helps strengthen the Rimcollian legacy.",
  },
];
export default function Home() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[429px] overflow-hidden">
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
            Welcome to Rimcollian Alumni Portal
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

      {/* Content Section */}
      <main className="flex-1 p-4">
        <div className="grid  bg-white shadow-md rounded-lg border border-gray-200">
          {aboutDetails.map((card, idx) => (
            <div key={idx} className="px-6 py-2">
              <h2 className="text-[24px]  font-semibold text-custom-blue">
                {card.title}
              </h2>
              <p className="text-[#797979] text-[16px] ">{card.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
    </div>
  );
}
