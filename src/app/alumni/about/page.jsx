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
const objectives = [
  "To execute programmes in consonance with the above aim and undertake such activities and through such means that promotes the object of enhancement of standards.",
  "To purchase, take on lease or in exchange or otherwise acquire any property which may be requisite for the purposes or, or conveniently used in connection with any of the objects of ROBA and in any way to transfer the same.",
  "To hire and employ personnel and to pay them and to other persons e.g. class III/IV employees of RIMC, salaries, honorariums, or grants in return for services rendered to ROBA and / or RIMC.",
  "To invest and deal with the money of ROBA not immediately required upon such securities as may from time to time be determined.",
  "To raise money in any manner as permitted by law, for furthering the Aims and Objects of ROBA, duly approved by the General Body.",
  "To adopt measures for enhancing the educational resources and other facilities for the RIMC.",
  "To render financial assistance to serving/retired Class III/IV employees of RIMC.",
  "To assist RIMC in maintaining a very high standard of education, sports and extra-curricular activities.",
  "To do all such other lawful things as are incidental or conducive to the attainment of the above objects.",
  "To award scholarships and prizes to deserving students of RIMC.",
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
      <main className="flex-1 p-4 container mx-auto ">
        <div className="flex  flex-col md:flex-row items-center justify-center w-full bg-white py-10 sm:px-10">
          {/* Left Section */}
          <div className="bg-[#0c1543] text-white p-10 md:w-1/2">
            <h2 className="text-3xl font-serif text-center text-white mb-4">
              AIM
            </h2>
            <p className="text-lg italic text-yellow-400">
              ROBA is a non-profit Association whose primary aim is to foster
              and strengthen the affinity between the alumni of the erstwhile
              Royal Indian Military College, and now the Rashtriya Indian
              Military College, Dehradun, hereinafter referred to as RIMC and
              the employees of the RIMC.
            </p>
          </div>

          {/* Right Section - Image */}
          <div className="md:w-1/2 flex justify-center p-6">
            <Image
              src="/about/roboimg.avif" // Ensure the image is inside the `public` folder or use a valid URL
              alt="ROBA Logo"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col items-center py-10  px-4">
          {/* Heading Section */}
          <div className="relative text-center mb-10">
            <h2 className="text-3xl font-serif border-2 border-black px-6 py-2 inline-block">
              ROBA OBJECTIVES
            </h2>
            <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-black transform scale-105"></div>
          </div>

          {/* Objectives Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="border-2 border-yellow-500 p-4 text-center bg-white shadow-md"
              >
                {objective}
              </div>
            ))}
          </div>
        </div>
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
