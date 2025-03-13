"use client";
import gettoken from "@/app/function/gettoken";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AllMenu = [
  { text: "Dashboard", link: "/admin/homepage" },
  { text: "Manage Users", link: "/admin/manageusers" },
  { text: "Manage Events", link: "/admin/manageevent" },
  { text: "Feedback", link: "#" },
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
            <h2 className=" font-bold text-gray-900 ">
              {userData?.name || "Admin"}
            </h2>
            <p className="text-gray-500 text-sm">{userData?.role || "Admin"}</p>
          </div>
        </div>
        <div className="w-full flex justify-between ">
          <button className="flex items-center text-sm text-gray-800 hover:text-gray-600">
            <Icon icon="uil:setting" width="24" height="24" className="mr-2" />{" "}
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="flex text-sm items-center text-gray-800 hover:text-gray-600"
          >
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
