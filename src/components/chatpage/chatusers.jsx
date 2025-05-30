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
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { unreadObj = {}, markAsRead, globalUnreadCount = 0, markGlobalAsRead } = useChatNotifications();

  React.useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const token = await gettoken();
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      const response = await fetch(`${url}/api/chat/recent-chats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.recentChats) {
        // Ensure each chat has a valid userId
        const validChats = data.recentChats.filter(chat => chat && chat.userId);
        setmemberdata(validChats);
      } else {
        toast.error(data?.message || "Failed to fetch chats");
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim() || !memberdata) return memberdata || [];
    return memberdata.filter((member) =>
      member?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, memberdata]);

  const handleChatClick = (userId) => {
    if (userId) {
      markAsRead(userId);
    }
  };

  const getUnreadCount = (userId) => {
    if (!userId || !unreadObj) return 0;
    return unreadObj[userId] || 0;
  };

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
          {filteredMembers?.map((user) => {
            if (!user?.userId) return null;

            const unreadCount = getUnreadCount(user.userId);

            return (
              <Link
                href={`/alumni/chat/${user.userId}`}
                key={user.userId}
                className={`flex items-center hover:bg-gray-200 cursor-pointer p-4 space-x-3 ${user?.active ? "bg-gray-200" : isDark ? "bg-[#2A3057]" : "bg-white"}`}
                onClick={() => handleChatClick(user.userId)}
              >
                <img
                  src={
                    user?.profilePicture
                      ? `${url}/uploads/${user?.profilePicture?.split("\\").pop()}`
                      : "/memberpage/member.png"
                  }
                  alt={user?.name || 'User'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{user?.name || 'Unknown User'}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{user?.message || 'No messages yet'}</p>
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-400'}`}>{user?.time || ''}</span>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Chatusers;
