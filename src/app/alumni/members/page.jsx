"use client";
import React from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";
import Link from "next/link";
import { useTheme } from "@/context/ThemeProvider";
import { useChatNotifications } from "@/context/ChatNotificationContext";

const UserCard = ({ name, id, url, batch, jobTitle, image, userid, location, profession }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={`mb-4 p-5 rounded-lg transition-all duration-200 ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-black'
        } shadow hover:shadow-lg`}
    >
      <div className="flex items-start gap-4">
        <img
          src={
            image
              ? `${url}/uploads/${image?.split("\\").pop()}`
              : "/memberpage/member.png"
          }
          alt={name}
          className="w-16 h-16 rounded-full object-cover border border-gray-300"
        />
        <div className="flex-1 space-y-1">
          <h2 className="font-semibold text-base"><span className="text-black">Name: </span> {name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300"><span className="text-black">Profession:</span> {profession}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300"><span className="text-black">Location:</span> {location}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{batch}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{jobTitle}</p>
        </div>

        {userid !== id && (
          <Link
            href={`/alumni/chat/${id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <div className="flex items-center gap-1">
              <Icon icon="tabler:send" width="18" height="18" />
              Message
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

const GlobalChatCard = () => {
  const { theme } = useTheme();
  const { globalUnreadCount } = useChatNotifications();
  const isDark = theme === 'dark';

  return (
    <div
      className={`mb-4 p-5 rounded-lg transition-all duration-200 ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-black'
        } shadow hover:shadow-lg`}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
          <Icon icon="mdi:account-group" width="32" height="32" className="text-white" />
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="font-semibold text-base">Global Chat</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Connect with all alumni members</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Share updates and announcements</p>
        </div>
        <Link
          href="/alumni/chat/global"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <div className="flex items-center gap-1">
            <Icon icon="tabler:send" width="18" height="18" />
            Join Chat
            {globalUnreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {globalUnreadCount > 9 ? '9+' : globalUnreadCount}
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

const Allmembers = () => {
  const [activeTab, setActiveTab] = React.useState("faculties");
  const [memberdata, setMemberData] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [user, setUser] = React.useState(null);
  const [originalData, setOriginalData] = React.useState([]);

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

  // Load user data on component mount
  React.useEffect(() => {
    getUser();
  }, []);

  // Dynamic search effect - searches as you type
  React.useEffect(() => {
    if (originalData.length > 0) {
      // Only perform search if we have data loaded
      if (searchTerm.trim() === '') {
        // If search is empty, reset to original data
        setMemberData(originalData);
      } else {
        // Filter based on search term
        const filtered = originalData.filter((member) =>
          member?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          member?.location?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
          member?.profession?.toLowerCase()?.includes(searchTerm.toLowerCase())
        );
        setMemberData(filtered);
      }
    }
  }, [searchTerm, originalData]);

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
        setOriginalData(data); // Store original data for filtering
      } else {
        toast.error(data?.message || "Failed to load members.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  // We don't need these functions anymore since search is dynamic
  // Keeping them for reference in case we need to revert
  /*
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setMemberData(originalData);
    } else {
      const filtered = originalData.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMemberData(filtered);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  */

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'}`} >
      <div className="min-h-screen pt-8 px-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">All Alumni Member</h2>

          {/* Search Section - Removed form and made search dynamic */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="text"
              placeholder="Search by name"
              className={`flex-1 px-4 py-2 ${isDark ? 'border-[#3D437E] bg-[#2A3057] text-white placeholder-gray-400' : 'border-gray-300 bg-white text-[#131A45]'} border rounded-md focus:outline-none w-[60%]`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className={`${isDark ? 'bg-[#2A3057]' : 'bg-custom-blue text-white'} px-6 py-2 rounded-md w-[30%] sm:w-60`}
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          </div>

          {/* Results Count */}
          <p className="mb-4 mt-6 text-gray-700">{memberdata?.length} Results</p>

          {/* Global Chat Card */}
          <div className="mb-6">
            <GlobalChatCard />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberdata.map((val, index) => (
              <UserCard
                key={index}
                id={val._id}
                name={val.name}
                batch={val.batch}
                location={val?.location}
                jobTitle={val.role}
                profession={val?.profession}
                image={val.profilePicture}
                userid={user?.id}
                url={url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allmembers;