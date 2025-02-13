"use client";
import React from "react";
import Logo from "./logo";
import { Icon } from "@iconify/react";
import Link from "next/link";

const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="bg-custom-blue text-white p-4 flex justify-between items-center relative">
      {/* Logo */}
      <Link href="/alumni/homepage" className="w-16 ">
        <Logo textwhite={true} isfooter={true} />
      </Link>

      {/* Hamburger Menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden z-10 border rounded-md border-[#C7A006]"
      >
        <Icon icon="material-symbols:menu-rounded" width="32" height="32" />
      </button>

      {/* Desktop Menu */}
      <nav className="space-x-4 hidden md:block">
        <a href="/alumni/about" className="hover:text-gray-300">
          About Us
        </a>
        <a href="/alumni/events" className="hover:text-gray-300">
          Event
        </a>
        <a href="/alumni/members" className="hover:text-gray-300">
          Member
        </a>
        <a href="/alumni/contact" className="hover:text-gray-300">
          Contact
        </a>
      </nav>

      {/* Icons */}
      <div className=" gap-3  hidden md:flex">
        <div className="border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg">
          <Icon icon="iconoir:message" width="24" height="24" />
        </div>
        <div className="border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg">
          <Icon icon="line-md:bell" width="24" height="24" />
        </div>
        <div className="border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg">
          <Icon icon="lucide:user" width="24" height="24" />
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <nav
        className={`absolute z-50 top-full left-0 w-full bg-custom-blue text-white p-4 transform origin-top ${
          menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
        } transition-transform duration-300 ease-in-out md:hidden`}
        style={{ transformOrigin: "top" }}
      >
        <ul className="flex flex-col text-end gap-4">
          <li>
            <a href="/alumni/profile" className="hover:text-gray-300">
              Profile
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Chat
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Notification
            </a>
          </li>

          <li>
            <a href="/alumni/about" className="hover:text-gray-300">
              About Us
            </a>
          </li>
          <li>
            <a href="/alumni/events" className="hover:text-gray-300">
              Event
            </a>
          </li>

          <li>
            <a href="/alumni/contact" className="hover:text-gray-300">
              Contact
            </a>
          </li>
          <li className="flex justify-end ">
            <Link
              href="/login"
              className="bg-[#FFFFFF]  flex items-center text-center hover:bg-gray-200 text-[#131A45] text-sm font-bold py-3 px-10 w-[150px] rounded-lg"
            >
              Login
              <Icon
                className="ml-2"
                icon="material-symbols-light:logout"
                width="20"
                height="20"
              />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
