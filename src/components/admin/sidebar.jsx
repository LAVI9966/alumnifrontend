"use client";
import gettoken from "@/app/function/gettoken";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AllMenu = [
  { text: "Dashboard", link: "/admin/homepage" },
  { text: "Manage Users", link: "/admin/manageusers" },
  { text: "Manage Events", link: "/admin/manageevent" },
  { text: "Manage Contacts", link: "/admin/contactus" },
];
const AdminSidebar = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = await gettoken();
        const response = await fetch(`${url}/api/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token in headers
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUserData(data.user);
        } else {
          toast.error(data?.message || "failed.");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred. Please try again.");
      }
    };
    getProfile();
  }, []);
  // Logout function: remove token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("alumni");
    router.push("/login");
  };

  // Theme logic for sidebar
  const { useTheme } = require("@/context/ThemeProvider");
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <aside className={`w-64 p-4 space-y-6 border-r-[1px] flex flex-col justify-between ${isDark ? 'bg-[#232B4A] text-white border-[#232B4A]' : 'bg-cyan-300 text-custom-blue border-[#E5E5E5]'}`}>
      <nav>
        <Link href="/admin/homepage">
          <Image
            width={200}
            height={100}
            src="/logoimage.png"
            alt="Rimcollian Logo"
            className={`h-[85px] ml-3 w-[85px] ${isDark ? 'bg-white rounded-full' : 'bg-cyan-400 rounded-full'}`}
          />
        </Link>
        <ul className="space-y-2 mt-10">
          {AllMenu.map((val, index) => (
            <li key={index}>
              <Link
                href={val.link}
                className={`flex items-center gap-2 p-1 rounded-3xl transition-all duration-300 ease-in-out 
                  ${isDark ? 'text-white hover:text-yellow-300' : 'text-custom-blue hover:text-[#131A45]'}`}
              >
                {val.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`${isDark ? 'bg-[#131A45] text-white' : 'bg-white text-[#131A45]'} shadow-md rounded-2xl p-4 w-full flex flex-col gap-4`}>
        <div className="flex items-center">
          <Icon icon="lets-icons:user-cicrle-duotone" width="60" height="60" className={isDark ? 'text-yellow-300' : 'text-[#131A45]'} />
          <div>
            <h2 className={`font-bold ${isDark ? 'text-white' : 'text-[#131A45]'}`}>{userData?.name || "Admin"}</h2>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{userData?.role || "Admin"}</p>
          </div>
        </div>
        <div className="w-full flex justify-start">
          <button
            onClick={handleLogout}
            className={`flex text-sm items-center ml-2 font-semibold rounded-lg px-3 py-1 transition-colors duration-200 
              ${isDark ? 'text-white hover:text-yellow-300 bg-[#232B4A] hover:bg-[#1a2154]' : 'text-[#131A45] hover:text-[#C7A006] bg-white hover:bg-gray-100'}`}
          >
            <Icon
              icon="material-symbols:logout-rounded"
              width="24"
              height="24"
              className="mr-2"
            />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
