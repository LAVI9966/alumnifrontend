"use client";
import React from "react";
import { Icon } from "@iconify/react";
const UserCard = ({ name, batch, jobTitle, image }) => (
  <div className="bg-white shadow-md rounded-xl p-2 flex items-start space-x-4">
    <img
      src={image || "/memberpage/member.png"}
      alt={name}
      className="w-16 h-16 rounded-full"
    />
    <div className="flex-1">
      <h2 className="font-semibold text-gray-800">{name}</h2>
      <p className="text-sm text-[#797979]">{batch}</p>
      <p className="text-sm text-[#797979]">{jobTitle}</p>
    </div>
    <button className="flex items-center gap-2 text-[#3271FF] font-medium hover:text-[#3570f9]">
      <Icon icon="tabler:send" width="24" height="24" /> Message
    </button>
  </div>
);

const Allmembers = () => {
  const [activeTab, setActiveTab] = React.useState("faculties");

  const users = Array(6).fill({
    name: "John Doe",
    batch: "Batch of 2010",
    jobTitle: "Software Engineer",
    image: "",
  });

  return (
    <div className="min-h-screen bg-gray-100 pt-8 px-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Section */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search by name, batch year"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none w-[60%]"
          />
          <button className="bg-custom-blue text-white px-6 py-2 rounded-md w-[30%] sm:w-60">
            Search
          </button>
        </div>

        {/* Tabs */}

        <div className="flex">
          <button
            className={`flex-1 px-4 border-b-2  py-2 font-medium transition-all duration-300 ${
              activeTab === "faculties"
                ? " border-custom-blue text-custom-blue"
                : "text-gray-600 border-transparent hover:text-custom-blue"
            }`}
            onClick={() => setActiveTab("faculties")}
          >
            Faculties
          </button>
          <button
            className={`flex-1 px-4 py-2 font-medium transition-all duration-300 ${
              activeTab === "member"
                ? "border-b-2 border-custom-blue text-custom-blue"
                : "text-gray-600 hover:text-custom-blue"
            }`}
            onClick={() => setActiveTab("member")}
          >
            Member
          </button>
        </div>

        {/* Results Count */}
        <p className="mb-4 mt-6 text-gray-700">120 Results</p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <UserCard
              key={index}
              name={user.name}
              batch={user.batch}
              jobTitle={user.jobTitle}
              image={user.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Allmembers;
