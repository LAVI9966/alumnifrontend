"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const AllMenu = [
  { text: "Dashboard", link: "/admin/homepage" },
  { text: "Manage Users", link: "/admin/manageusers" },
  { text: "Manage Events", link: "#" },
  { text: "Feedback", link: "#" },
];
const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-[#FFFFFF] text-custom-blue p-4 space-y-6 border-r-[1px] flex flex-col justify-between border-[#E5E5E5]">
      <nav>
        <Link href="/admin/homepage">
          <Image
            width={200}
            height={100}
            src="/logoimage.png"
            alt="Rimcollian Logo"
            className="h-[85px] ml-3 w-[85px]"
          />
        </Link>
        <ul className="space-y-2 mt-10">
          {AllMenu.map((val, index) => (
            <li key={index}>
              <Link
                href={val.link}
                className="flex items-center gap-2 p-1  rounded-3xl text-custom-blue  hover:text-gray-900 transition-all duration-300 ease-in-out"
              >
                {val.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="bg-white shadow-md rounded-2xl p-4 w-full flex flex-col gap-4 ">
        <div className="flex  items-center">
          <Icon icon="lets-icons:user-cicrle-duotone" width="60" height="60" />
          <div>
            <h2 className=" font-bold text-gray-900 ">Balajee Mishra</h2>
            <p className="text-gray-500 text-sm">Admin</p>
          </div>
        </div>
        <div className="w-full flex justify-between ">
          <button className="flex items-center text-sm text-gray-800 hover:text-gray-600">
            <Icon icon="uil:setting" width="24" height="24" className="mr-2" />{" "}
            Settings
          </button>
          <button className="flex text-sm items-center text-gray-800 hover:text-gray-600">
            <Icon
              icon="material-symbols:logout-rounded"
              width="24"
              height="24"
              className="mr-2"
            />{" "}
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
