import gettoken from "@/app/function/gettoken";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useMemo } from "react";
import toast from "react-hot-toast";

const Chatusers = () => {
  const [memberdata, setmemberdata] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const url = process.env.NEXT_PUBLIC_URL;
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
          Authorization: `Bearer ${token}`, // Add token in headers
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
    <div className=" w-full bg-white  shadow-md overflow-scroll max-h-[600px] scrollbar-hide ">
      {/* Search Bar */}
      <div className="p-2">
        <div className="p-2 bg-gray-100 flex items-center space-x-2 rounded-xl">
          <Icon
            className="text-gray-500"
            icon="mynaui:search"
            width="24"
            height="24"
          />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 w-full outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* Chat List */}
      <ul className="divide-y divide-gray-200">
        {filteredMembers?.map((user, index) => (
          <Link
            href={`/alumni/chat/${user.userId}`}
            key={user?.userId}
            className={`flex items-center hover:bg-gray-200 cursor-pointer p-4 space-x-3 ${
              user.active ? "bg-gray-200" : "bg-white"
            }`}
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
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.message}</p>
            </div>
            <span className="text-gray-400 text-sm">{user.time}</span>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Chatusers;
