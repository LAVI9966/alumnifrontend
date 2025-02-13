import { Icon } from "@iconify/react";
import React from "react";

const Postcard = () => {
  return (
    <div className="mt-4 p-4 bg-white  shadow-md rounded-lg">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="ml-3">
          <p className="font-semibold text-sm">User Name</p>
          <p className="text-xs text-gray-500">Date Posted</p>
        </div>
      </div>
      <p className="font-bold text-sm">
        Lorem ipsum dolor sit amet consectetur. Purus lectus nisl luctus nisl.
        Eu egestas mi justo non gravida.
      </p>
      <p className="text-xs text-gray-600 mt-2">
        Lorem ipsum dolor sit amet consectetur. A lectus potenti fermentum eget
        adipiscing nulla dolor egestas.
      </p>
      <div className="w-full h-[266px] bg-gray-200 mt-3"></div>
      <div className="flex justify-between items-center mt-3 text-gray-500 text-sm">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
          <p className="ml-1">Liked by 183 members</p>
        </div>
        <div className="flex space-x-3">
          <Icon
            icon="icon-park-outline:like"
            width="28"
            height="28"
            className="text-gray-500 hover:text-custom-blue cursor-pointer transition-colors"
          />

          <Icon
            icon="lets-icons:comment"
            width="28"
            height="28"
            className="text-gray-500 hover:text-custom-blue cursor-pointer transition-colors"
          />
          <Icon
            icon="mingcute:send-line"
            width="28"
            height="28"
            className="text-gray-500 hover:text-custom-blue cursor-pointer transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default Postcard;
