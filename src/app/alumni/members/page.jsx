"use client";
import React from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";
import Link from "next/link";
import { useTheme } from "@/context/ThemeProvider";
const UserCard = ({ name, id, url, batch, jobTitle, image, userid }) => {
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  return <div className={`mb-4 p-4 relative ${isDark ? 'bg-[#2A3057]' : 'bg-white'} shadow-md rounded-lg`}>
    <div className="flex items-start space-x-4">
      <img
        src={
          image
            ? `${url}/uploads/${image?.split("\\").pop()}`
            : "/memberpage/member.png"
        }
        alt={name}
        className="w-16 h-16 rounded-full"
      />
      <div className="flex-1">
        <h2 className="font-semibold">{name}</h2>
        <p className="text-sm text-[#797979]">{batch}</p>
        <p className="text-sm text-[#797979]">{jobTitle}</p>
      </div>

      {userid === id ? (
        ""
      ) : (
        <Link
          href={`/alumni/chat/${id}`}
          className="flex items-center gap-2 text-[#3271FF] font-medium hover:text-[#3570f9]"
        >
          <Icon icon="tabler:send" width="24" height="24" /> Message
        </Link>
      )}
    </div>
  </div>
}

const Allmembers = () => {
  const [activeTab, setActiveTab] = React.useState("faculties");
  const [memberdata, setMemberData] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
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
  React.useEffect(() => {
    getUser();
  }, [searchTerm]);

  const getUser = async () => {
    try {
      const token = await gettoken();

      const response = await fetch(`${url}/api/members/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMemberData(data);
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  const handleSearch = () => {
    const filtered = memberdata?.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMemberData(filtered);
  };
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  return (
    <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-cyan-400'}`} >
      <div className="min-h-screen  pt-8 px-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">All Alumni Member</h2>
          {/* Search Section */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              placeholder="Search by name"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none w-[60%]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className={`${isDark ? 'bg-[#2A3057]' : 'bg-custom-blue text-white'} px-6 py-2 rounded-md w-[30%] sm:w-60`}
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          {/* Tabs */}

          {/* <div className="flex">
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
        </div> */}

          {/* Results Count */}
          <p className="mb-4 mt-6 text-gray-700">{memberdata?.length} Results</p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberdata.map((val, index) => (
              <UserCard
                key={index}
                id={val._id}
                name={val.name}
                // batch={val.batch}
                jobTitle={val.role}
                image={val.profilePicture}
                userid={user?.id}
                url={url}
              />
            ))}
          </div>
        </div>
      </div></div>
  );
};

export default Allmembers;
