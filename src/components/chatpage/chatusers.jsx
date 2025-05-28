import gettoken from "@/app/function/gettoken";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useChatNotifications } from "@/context/ChatNotificationContext";
import toast from "react-hot-toast";
import { useTheme } from "@/context/ThemeProvider";

const Chatusers = () => {
  const [memberdata, setmemberdata] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const url = process.env.NEXT_PUBLIC_URL;
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { unreadObj, markAsRead, globalUnreadCount, markGlobalAsRead } = useChatNotifications();

  React.useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const token = await gettoken();

      const response = await fetch(`${url}/api/chat/recent-chats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setmemberdata(data.recentChats);
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return memberdata;
    return memberdata.filter((member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, memberdata]);

  return (
    <div className={`max-h-[600px] ${isDark ? 'bg-[#2A3057]' : 'bg-white'} `}>
      <div className={`w-full shadow-md overflow-scroll max-h-[600px] scrollbar-hide `}>
        {/* Search Bar */}
        <div className="p-2">
          <div className="p-2 flex items-center space-x-2 rounded-xl">
            <Icon
              className="text-gray-500"
              icon="mynaui:search"
              width="24"
              height="24"
            />
            <input
              type="text"
              placeholder="Search"
              className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'} w-full`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Global Group Chat */}
        <Link
          href="/alumni/chat/global"
          className={`flex items-center hover:bg-gray-200 cursor-pointer p-4 space-x-3 ${isDark ? 'bg-[#3A4070]' : 'bg-gray-50'} border-b border-gray-200`}
          onClick={() => markGlobalAsRead()}
        >
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
            <Icon icon="mdi:account-group" className="text-white" width="24" height="24" />
          </div>
          <div className="flex-1">
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Global Chat</p>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Chat with all alumni members</p>
          </div>
          {globalUnreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
              {globalUnreadCount > 9 ? '9+' : globalUnreadCount}
            </span>
          )}
        </Link>

        {/* Chat List */}
        <ul className="divide-y divide-gray-200">
          {filteredMembers?.map((user, index) => (
            <Link
              href={`/alumni/chat/${user.userId}`}
              key={user?.userId}
              className={`flex items-center hover:bg-gray-200 cursor-pointer p-4 space-x-3 ${user.active ? "bg-gray-200" : isDark ? "bg-[#2A3057]" : "bg-white"}`}
              onClick={() => markAsRead(user.userId)}
            >
              <img
                src={
                  user?.profilePicture
                    ? `${url}/uploads/${user?.profilePicture?.split("\\").pop()}`
                    : "/memberpage/member.png"
                }
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{user.message}</p>
              </div>
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>{user.time}</span>
              {unreadObj[user.userId] > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {unreadObj[user.userId] > 9 ? '9+' : unreadObj[user.userId]}
                </span>
              )}
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chatusers;
