"use client";
import Chatusers from "@/components/chatpage/chatusers";
import React from "react";
import { useTheme } from "@/context/ThemeProvider";
const Chat = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'}`}>
      <div className={`min-h-screen max-w-[1200px] w-full mx-auto flex gap-3  ${isDark ? 'bg-[#2A3057]' : 'bg-white'}  pt-8 `}>
        <div className="w-full px-4 lg:px-0 lg:w-[25%] ">
          <Chatusers />
        </div>
        <div className={`max-w-[900px] w-full lg:w-[75%]  mx-auto  ${isDark ? 'bg-[#2A3057]' : 'bg-white'} shadow-lg rounded-lg  h-[600px]  hidden lg:flex flex-col `}>
          <div className="flex items-center justify-center h-full">
            <p className="text-lg text-gray-500">Select a user to chat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
