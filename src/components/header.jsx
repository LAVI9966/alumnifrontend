"use client";
import React, { useEffect } from "react";
import Logo from "./logo";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "../app/alumni/notification/NotificationContext";
import { useTheme } from "../context/ThemeProvider"; // Import the theme context

const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';

  const { notificationCount, fetchNotificationCount } = useNotifications();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount]);

  const handleLogout = () => {
    localStorage.removeItem("alumni");
    router.push("/login");
  };

  return (
    <header className={`${isDark ? 'bg-white text-[#131A45]' : 'bg-custom-blue text-white'} p-4 flex justify-between items-center relative transition-colors duration-200`}>
      {/* Logo */}
      <Link href="/alumni/homepage" className="w-16">
        <Logo textwhite={true} isfooter={true} />
      </Link>

      {/* Hamburger Menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`md:hidden z-10 border rounded-md ${isDark ? 'border-[#131A45] text-[#131A45]' : 'border-[#C7A006]'} transition-colors duration-200`}
      >
        <Icon
          icon="material-symbols:menu-rounded"
          width="32"
          height="32"
          className={isDark ? 'border-[#131A45] text-[#131A45]' : 'text-white'}
        />
      </button>

      {/* Desktop Menu */}
      <nav className="space-x-4 hidden md:block">
        <Link href="/alumni/about" className={`${isDark ? 'text-[#131A45]  hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          About Us
        </Link>
        <Link href="/alumni/events" className={`${isDark ? 'text-[#131A45] hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          Event
        </Link>
        <Link href="/alumni/members" className={`${isDark ? 'text-[#131A45] hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          Member
        </Link>
        <Link href="/alumni/contact" className={`${isDark ? 'text-[#131A45]  hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          Contact
        </Link>
        <Link href="/alumni/souvenir_shop" className={`${isDark ? 'text-[#131A45]  hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          Souvenir shop
        </Link>
      </nav>

      {/* Icons */}
      <div className="gap-3 hidden md:flex items-center">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg transition-colors duration-200 ${isDark ? 'border-[#131A45] text-[#131A45]' : 'border-white text-white'
            }`}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <Icon icon="ph:sun" width="24" height="24" />
          ) : (
            <Icon icon="ph:moon" width="24" height="24" />
          )}
        </button>

        {/* Chat Icon */}
        <Link
          href="/alumni/chat"
          className={`border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg ${isDark ? 'border-[#131A45] text-[#131A45]' : 'border-white text-white'
            } transition-colors duration-200`}
        >
          <Icon icon="iconoir:message" width="24" height="24" />
        </Link>

        {/* Notification Icon */}
        <div className="relative">
          <Link
            href="/alumni/notification"
            className={`border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg ${isDark ? 'border-[#131A45] text-[#131A45]' : 'border-white text-white'
              } transition-colors duration-200`}
          >
            <Icon icon="line-md:bell" width="24" height="24" />
          </Link>
          {notificationCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </div>
          )}
        </div>

        {/* Profile Icon */}
        <Link
          href="/alumni/profile"
          className={`border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg ${isDark ? 'border-[#131A45] text-[#131A45]' : 'border-white text-white'
            } transition-colors duration-200`}
        >
          <Icon icon="lucide:user" width="24" height="24" />
        </Link>
      </div>

      {/* Mobile Dropdown Menu */}
      <nav
        className={`absolute z-50 top-full left-0 w-full ${isDark ? 'bg-gray-900 text-white' : 'bg-custom-blue text-white'
          } p-4 transform origin-top ${menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          } transition-all duration-300 ease-in-out md:hidden`}
        style={{ transformOrigin: "top" }}
      >
        <ul className="flex flex-col text-end gap-4">
          <li>
            <Link
              href="/alumni/profile"
              className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200`}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/alumni/chat"
              className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200`}
            >
              Chat
            </Link>
          </li>
          <li>
            <Link
              href="/alumni/members"
              className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200`}
            >
              Members
            </Link>
          </li>
          <li>
            <Link
              href="/alumni/souvenir_shop"
              className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200`}
            >
              Souvenir shop
            </Link>
          </li>
          <li className="flex items-center justify-end">
            <Link
              href="/alumni/notification"
              className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200 relative`}
            >
              Notification
              {notificationCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              href="/alumni/about"
              className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200`}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/alumni/events"
              className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200`}
            >
              Event
            </Link>
          </li>
          <li>
            <Link
              href="/alumni/contact"
              className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200`}
            >
              Contact
            </Link>
          </li>
          {/* Theme Toggle Button in Mobile Menu */}
          <li className="flex items-center justify-end">
            <button
              onClick={toggleTheme}
              className={`flex items-center ${isDark ? 'text-white hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? "Light Mode " : "Dark Mode "}
              <Icon
                className="ml-2"
                icon={isDark ? "ph:sun" : "ph:moon"}
                width="20"
                height="20"
              />
            </button>
          </li>
          <li className="flex justify-end">
            <div
              onClick={handleLogout}
              className={`${isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-[#FFFFFF] text-[#131A45] hover:bg-gray-200'
                } flex items-center text-center text-sm font-bold py-3 px-10 w-[150px] rounded-lg transition-colors duration-200`}
            >
              Logout
              <Icon
                className="ml-2"
                icon="material-symbols-light:logout"
                width="20"
                height="20"
              />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;