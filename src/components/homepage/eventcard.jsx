import Image from "next/image";
import React from "react";
import { useTheme } from "@/context/ThemeProvider";
const Eventcard = ({ date, title, description, src, url }) => {
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  return (
    <div className={`flex w-[317px] lg:w-full  ${isDark ? 'bg-[#2A3057] ' : 'bg-white'} shadow-md rounded-lg overflow-hidden p-3`}>
      <Image
        width={300}
        height={300}
        src={
          src
            ? `${url}/uploads/${src?.split("\\").pop()}`
            : "/events/events.jfif"
        }
        alt="Event"
        className="w-[152px] h-[109px] rounded-md object-cover"
      />
      <div className="flex ml-3 flex-col justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-400">Event</p>
          <h3 className="font-bold text-sm truncate max-w-[160px]">{title}</h3>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-700">
            {" "}
            {new Date(date).toISOString().split("T")[0]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Eventcard;
