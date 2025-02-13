import Image from "next/image";
import React from "react";

const Eventcard = () => {
  return (
    <div className="flex w-[317px]  bg-white shadow-md rounded-lg overflow-hidden p-3">
      <Image
        width={300}
        height={300}
        src="/homepage/eventimg.jfif"
        alt="Event"
        className="w-[152px] h-[109px] rounded-md object-cover"
      />
      <div className="flex ml-3 flex-col justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-400">Event</p>
          <h3 className="font-bold text-sm">Alumni Meet</h3>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-700">12 Feb, 25</p>
          <p className="text-sm text-gray-700">Dummy Location</p>
        </div>
      </div>
    </div>
  );
};

export default Eventcard;
