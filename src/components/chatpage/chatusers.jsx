import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

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
  return (
    <div className=" w-full bg-white  shadow-md overflow-scroll max-h-[600px] ">
      {/* Search Bar */}
      <div className="p-2">
        <div className="p-2 bg-gray-100 flex items-center space-x-2 rounded-xl ">
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
          />
        </div>
      </div>
      {/* Chat List */}
      <ul className="divide-y divide-gray-200">
        {users.map((user, index) => (
          <Link
            href="/alumni/chat/2"
            key={index}
            className={`flex items-center hover:bg-gray-200 cursor-pointer p-4 space-x-3 ${
              user.active ? "bg-gray-200" : "bg-white"
            }`}
          >
            <img
              src={user.image}
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
