import gettoken from "@/app/function/gettoken";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useMemo } from "react";
import toast from "react-hot-toast";

const users = [
  {
    name: "Pratyush Solanki",
    message: "Hi",
    time: "1d",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    active: true,
  },
  {
    name: "Neha Pramod",
    message: "Hi",
    time: "1m",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    active: false,
  },
  {
    name: "Ayush Dhyan",
    message: "Hi",
    time: "36s",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    active: false,
  },
  {
    name: "Ravi Agarwal",
    message: "Hi",
    time: "3w",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    active: false,
  },
  {
    name: "Param N",
    message: "Hi",
    time: "12m",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    active: false,
  },
  {
    name: "Surya Kala",
    message: "Hi",
    time: "1h",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    active: false,
  },
  {
    name: "Devdas B",
    message: "Hi",
    time: "5m",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    active: false,
  },
  {
    name: "Ayush Dhyan",
    message: "Hi",
    time: "36s",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    active: false,
  },
  {
    name: "Ravi Agarwal",
    message: "Hi",
    time: "3w",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    active: false,
  },
  {
    name: "Param N",
    message: "Hi",
    time: "12m",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    active: false,
  },
  {
    name: "Surya Kala",
    message: "Hi",
    time: "1h",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    active: false,
  },
  {
    name: "Devdas B",
    message: "Hi",
    time: "5m",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    active: false,
  },
  {
    name: "Ayush Dhyan",
    message: "Hi",
    time: "36s",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    active: false,
  },
  {
    name: "Ravi Agarwal",
    message: "Hi",
    time: "3w",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    active: false,
  },
  {
    name: "Param N",
    message: "Hi",
    time: "12m",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    active: false,
  },
  {
    name: "Surya Kala",
    message: "Hi",
    time: "1h",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    active: false,
  },
  {
    name: "Devdas B",
    message: "Hi",
    time: "5m",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    active: false,
  },
];

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
      console.log(token);

      const response = await fetch(`${url}/api/members/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setmemberdata(data);
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      console.log(error);
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
            href={`/alumni/chat/${user._id}`}
            key={user._id}
            className={`flex items-center hover:bg-gray-200 cursor-pointer p-4 space-x-3 ${
              user.active ? "bg-gray-200" : "bg-white"
            }`}
          >
            <img
              src="https://randomuser.me/api/portraits/men/1.jpg"
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
