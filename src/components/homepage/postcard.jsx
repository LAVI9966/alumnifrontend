"use client";
import gettoken from "@/app/function/gettoken";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const timeAgo = (timestamp) => {
  if (!timestamp) return "Invalid date";

  const now = new Date();
  const past = new Date(timestamp);

  if (isNaN(past.getTime())) return "Invalid date"; // Handle invalid timestamps

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 1) return "Just now"; // If less than 1 second difference

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const count = Math.floor(diffInSeconds / seconds);
    if (count > 0) {
      return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

import React from "react";
import toast from "react-hot-toast";
import CreatePostDialogue from "./createpostdialogue";
import Link from "next/link";
const Postcard = ({ postData, getPosts, userid }) => {
  const [showComments, setShowComments] = React.useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  const handleDelete = async (id) => {
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data?.message || "successfully deleted.");
        getPosts();
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <div className="mb-4 p-4 relative bg-white shadow-md rounded-lg">
      {/* User Info */}
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center mb-2">
          {userid === postData?.user?._id ? (
            <Avatar className=" cursor-pointer">
              <AvatarImage
                className="w-10 h-10 rounded-full"
                src={
                  postData?.user?.profilePicture
                    ? `${url}/uploads/${postData?.user?.profilePicture
                        ?.split("\\")
                        .pop()}`
                    : "/memberpage/member.png"
                }
                alt="avtar"
              />
            </Avatar>
          ) : (
            <Link href={`chat/${postData?.user?._id}`}>
              <Avatar className=" cursor-pointer">
                <AvatarImage
                  className="w-10 h-10 rounded-full"
                  src={
                    postData?.user?.profilePicture
                      ? `${url}/uploads/${postData?.user?.profilePicture
                          ?.split("\\")
                          .pop()}`
                      : "/memberpage/member.png"
                  }
                  alt="avtar"
                />
              </Avatar>{" "}
            </Link>
          )}

          <div className="ml-3">
            <p className="font-semibold text-sm">{postData.user.name}</p>
            <p className="text-xs text-gray-500">
              {timeAgo(postData?.createdAt)}
            </p>
          </div>
        </div>
        {userid === postData?.user?._id ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Icon
                icon="qlementine-icons:menu-dots-16"
                width="28"
                height="28"
                className="cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 mr-10 sm:mr-16 bg-white shadow-lg rounded-lg">
              <CreatePostDialogue getPosts={getPosts} postData={postData} />
              <DropdownMenuItem
                onClick={() => handleDelete(postData?._id)}
                className="cursor-pointer w-full mx-auto hover:bg-gray-100 px-4 py-2 text-red-600"
              >
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div></div>
        )}
      </div>
      {/* Post Content */}
      <p className="font-bold text-sm">{postData?.content}</p>
      {/* <p className="text-xs text-gray-600 mt-2">
        Lorem ipsum dolor sit amet consectetur. A lectus potenti fermentum eget
        adipiscing nulla dolor egestas.
      </p> */}
      <div className="w-full h-auto bg-gray-200 mt-3">
        <Image
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={`${url}/uploads/${postData?.imageUrl?.split("\\").pop()}`}
          alt="postimg"
          width={400}
          height={400}
          style={{ objectFit: "contain", width: "100%" }}
          className="max-h-[400px]"
        />
      </div>
    </div>
  );
};

export default Postcard;

//  {/* Like & Comment Icons */}
//  <div className="flex justify-between items-center mt-3 text-gray-500 text-sm">
//  <div className="flex items-center">
//    <div className="flex -space-x-3 overflow-hidden">
//      <Avatar className="hover:z-10 focus:z-10 cursor-pointer">
//        <AvatarImage
//          className="w-6 h-6 rounded-full  "
//          src="https://github.com/shadcn.png"
//          alt="avtar"
//        />
//      </Avatar>
//      <Avatar className="hover:z-10 focus:z-10 cursor-pointer">
//        <AvatarImage
//          className="w-6 h-6 rounded-full"
//          src="https://github.com/shadcn.png"
//          alt="avtar"
//        />
//      </Avatar>
//      <Avatar className="hover:z-10 focus:z-10 cursor-pointer">
//        <AvatarImage
//          className="w-6 h-6 rounded-full"
//          src="https://github.com/shadcn.png"
//          alt="avtar"
//        />
//      </Avatar>
//    </div>
//    <p className="ml-1">Liked by 183 members</p>
//  </div>
//  <div className="flex space-x-3">
//    <div className="relative group cursor-pointer">
//      {/* Outline Icon (Visible by Default) */}
//      <Icon
//        icon="icon-park-outline:like"
//        width="28"
//        height="28"
//        className="text-gray-500 transition-opacity group-hover:opacity-0"
//      />

//      {/* Solid Icon (Visible on Hover) */}
//      <Icon
//        icon="icon-park-solid:like"
//        width="28"
//        height="28"
//        className="text-custom-blue absolute top-0 left-0 transition-opacity opacity-0 group-hover:opacity-100"
//      />
//    </div>

//    <div
//      className="relative group cursor-pointer"
//      onClick={() => setShowComments(!showComments)}
//    >
//      {/* Comment Icon (Visible by Default) */}
//      <Icon
//        icon="majesticons:comment-text-line"
//        width="28"
//        height="28"
//        className="text-gray-500 transition-opacity group-hover:opacity-0"
//      />

//      {/* Comment Icon (Solid) on Hover */}
//      <Icon
//        icon="majesticons:comment-text"
//        width="28"
//        height="28"
//        className="text-custom-blue absolute top-0 left-0 transition-opacity opacity-0 group-hover:opacity-100"
//      />
//    </div>

//    <div className="relative group cursor-pointer">
//      {/* Share Icon (Visible by Default) */}
//      <Icon
//        icon="mingcute:send-line"
//        width="28"
//        height="28"
//        className="text-gray-500 transition-opacity group-hover:opacity-0"
//      />

//      {/* Share Icon (Solid) on Hover */}
//      <Icon
//        icon="mingcute:send-fill"
//        width="28"
//        height="28"
//        className="text-custom-blue absolute top-0 left-0 transition-opacity opacity-0 group-hover:opacity-100"
//      />
//    </div>
//  </div>
// </div>

// {/* Comment Section (Visible when clicking the comment icon) */}
// {showComments && (
//  <div className="mt-4 border-t pt-3">
//    <div className="space-y-4">
//      {/* Comment 1 */}
//      <div className="flex flex-col gap-2 ">
//        <div className="flex items-center gap-2">
//          <Avatar className=" cursor-pointer">
//            <AvatarImage
//              className="w-8 h-8 rounded-full  "
//              src="https://github.com/shadcn.png"
//              alt="avtar"
//            />
//          </Avatar>
//          <p className="font-semibold  ">User Name</p>
//          <p className="text-xs text-gray-600">14 min</p>
//        </div>
//        <div className="rounded-lg flex-1">
//          <p className="text-sm">
//            That's a fantastic new app feature. You and your team did an
//            excellent job of incorporating user testing feedback.
//          </p>
//          <div className="flex justify-between">
//            <div className="flex items-center text-gray-500 text-xs mt-1">
//              <p className="mr-2">1 Like</p>
//              <Icon
//                icon="fluent-mdl2:reply-mirrored"
//                width="14"
//                height="14"
//              />
//              <p className="cursor-pointer">Reply</p>
//            </div>
//            <div className="relative group cursor-pointer">
//              {/* Outline Icon (Visible by Default) */}
//              <Icon
//                icon="icon-park-outline:like"
//                width="20"
//                height="20"
//                className="text-gray-500 transition-opacity group-hover:opacity-0"
//              />

//              {/* Solid Icon (Visible on Hover) */}
//              <Icon
//                icon="icon-park-solid:like"
//                width="20"
//                height="20"
//                className="text-custom-blue absolute top-0 left-0 transition-opacity opacity-0 group-hover:opacity-100"
//              />
//            </div>
//          </div>
//        </div>
//      </div>

//      {/* Comment 2 (Reply) */}
//      <div className="flex space-x-3 mx-6 lg:mx-20">
//        <Avatar className=" cursor-pointer">
//          <AvatarImage
//            className="w-8 h-8 rounded-full  "
//            src="https://github.com/shadcn.png"
//            alt="avtar"
//          />
//        </Avatar>
//        <div className="px-3 rounded-lg flex-1">
//          <div className="flex gap-2 items-center">
//            <p className="font-semibold  ">User Name</p>
//            <p className="text-xs text-gray-600">24 min</p>
//          </div>
//          <p className="text-sm">
//            But don't you think the timing is off because many other apps
//            have done this even earlier, causing people to switch apps?
//          </p>
//          <div className="flex justify-between">
//            <div className="flex items-center text-gray-500 text-xs mt-1">
//              <p className="mr-2">1 Like</p>
//              <Icon
//                icon="fluent-mdl2:reply-mirrored"
//                width="14"
//                height="14"
//              />
//              <p className="cursor-pointer">Reply</p>
//            </div>
//            <div className="relative group cursor-pointer">
//              {/* Outline Icon (Visible by Default) */}
//              <Icon
//                icon="icon-park-outline:like"
//                width="20"
//                height="20"
//                className="text-gray-500 transition-opacity group-hover:opacity-0"
//              />

//              {/* Solid Icon (Visible on Hover) */}
//              <Icon
//                icon="icon-park-solid:like"
//                width="20"
//                height="20"
//                className="text-custom-blue absolute top-0 left-0 transition-opacity opacity-0 group-hover:opacity-100"
//              />
//            </div>
//          </div>
//        </div>
//      </div>

//      {/* Comment 3 */}
//      <div className="flex flex-col gap-2 ">
//        <div className="flex items-center gap-2">
//          <Avatar className=" cursor-pointer">
//            <AvatarImage
//              className="w-8 h-8 rounded-full  "
//              src="https://github.com/shadcn.png"
//              alt="avtar"
//            />
//          </Avatar>
//          <p className="font-semibold  ">User Name</p>
//          <p className="text-xs text-gray-600">14 min</p>
//        </div>
//        <div className="rounded-lg flex-1">
//          <p className="text-sm">
//            This could be due to them taking their time to release a
//            stable version.
//          </p>
//          <div className="flex justify-between">
//            <div className="flex items-center text-gray-500 text-xs mt-1">
//              <p className="mr-2">1 Like</p>
//              <Icon
//                icon="fluent-mdl2:reply-mirrored"
//                width="14"
//                height="14"
//              />
//              <p className="cursor-pointer">Reply</p>
//            </div>
//            <div className="relative group cursor-pointer">
//              {/* Outline Icon (Visible by Default) */}
//              <Icon
//                icon="icon-park-outline:like"
//                width="20"
//                height="20"
//                className="text-gray-500 transition-opacity group-hover:opacity-0"
//              />

//              {/* Solid Icon (Visible on Hover) */}
//              <Icon
//                icon="icon-park-solid:like"
//                width="20"
//                height="20"
//                className="text-custom-blue absolute top-0 left-0 transition-opacity opacity-0 group-hover:opacity-100"
//              />
//            </div>
//          </div>
//        </div>
//      </div>
//    </div>
//    <p className="text-center my-2">View More Replies </p>
//    {/* Comment Input */}
//    <div className="mt-4 flex items-center border-t pt-3">
//      <input
//        type="text"
//        placeholder="Type your comment here"
//        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
//      />
//      <button className="ml-2 bg-gray-300 p-2 rounded-lg">
//        <Icon icon="mingcute:send-line" width="24" height="24" />
//      </button>
//    </div>
//  </div>
// )}
