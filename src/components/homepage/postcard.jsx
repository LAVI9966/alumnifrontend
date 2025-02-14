"use client";
import { Icon } from "@iconify/react";
import React from "react";

const Postcard = () => {
  const [showComments, setShowComments] = React.useState(false);

  return (
    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
      {/* User Info */}
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="ml-3">
          <p className="font-semibold text-sm">User Name</p>
          <p className="text-xs text-gray-500">Date Posted</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="font-bold text-sm">
        Lorem ipsum dolor sit amet consectetur. Purus lectus nisl luctus nisl.
        Eu egestas mi justo non gravida.
      </p>
      <p className="text-xs text-gray-600 mt-2">
        Lorem ipsum dolor sit amet consectetur. A lectus potenti fermentum eget
        adipiscing nulla dolor egestas.
      </p>
      <div className="w-full h-[266px] bg-gray-200 mt-3"></div>

      {/* Like & Comment Icons */}
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
            onClick={() => setShowComments(!showComments)}
          />
          <Icon
            icon="mingcute:send-line"
            width="28"
            height="28"
            className="text-gray-500 hover:text-custom-blue cursor-pointer transition-colors"
          />
        </div>
      </div>

      {/* Comment Section (Visible when clicking the comment icon) */}
      {showComments && (
        <div className="mt-4 border-t pt-3">
          <div className="space-y-4">
            {/* Comment 1 */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="bg-gray-100 p-3 rounded-lg flex-1">
                <p className="text-xs text-gray-600">14 min</p>
                <p className="text-sm">
                  That's a fantastic new app feature. You and your team did an
                  excellent job of incorporating user testing feedback.
                </p>
                <div className="flex justify-between">
                  <div className="flex items-center text-gray-500 text-xs mt-1">
                    <p className="mr-2">1 Like</p>
                    <p className="cursor-pointer">Reply</p>
                  </div>
                  <Icon
                    icon="icon-park-outline:like"
                    width="20"
                    height="20"
                    className="text-gray-500 hover:text-custom-blue cursor-pointer transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Comment 2 (Reply) */}
            <div className="flex space-x-3 ml-12">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="bg-gray-100 p-3 rounded-lg flex-1">
                <p className="text-xs text-gray-600">24 min</p>
                <p className="text-sm">
                  But don't you think the timing is off because many other apps
                  have done this even earlier, causing people to switch apps?
                </p>
                <div className="flex justify-between">
                  <div className="flex items-center text-gray-500 text-xs mt-1">
                    <p className="mr-2">1 Like</p>
                    <p className="cursor-pointer">Reply</p>
                  </div>
                  <Icon
                    icon="icon-park-outline:like"
                    width="20"
                    height="20"
                    className="text-gray-500 hover:text-custom-blue cursor-pointer transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Comment 3 */}
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="bg-gray-100 p-3 rounded-lg flex-1">
                <p className="text-xs text-gray-600">28 min</p>
                <p className="text-sm">
                  This could be due to them taking their time to release a
                  stable version.
                </p>
                <div className="flex justify-between">
                  <div className="flex items-center text-gray-500 text-xs mt-1">
                    <p className="mr-2">1 Like</p>
                    <p className="cursor-pointer">Reply</p>
                  </div>
                  <Icon
                    icon="icon-park-outline:like"
                    width="20"
                    height="20"
                    className="text-gray-500 hover:text-custom-blue cursor-pointer transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="mt-4 flex items-center border-t pt-3">
            <input
              type="text"
              placeholder="Type your comment here"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
            />
            <button className="ml-2 bg-gray-300 p-2 rounded-lg">
              <Icon icon="mingcute:send-line" width="24" height="24" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Postcard;