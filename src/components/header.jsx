"use client";
import React, { useEffect, useRef } from "react";
import Logo from "./logo";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "../app/alumni/notification/NotificationContext";
import { useTheme } from "../context/ThemeProvider"; // Import the theme context

const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = React.useState(false);
  const [mobileAboutDropdownOpen, setMobileAboutDropdownOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  const aboutDropdownRef = useRef(null);
  const isAboutPage = pathname === "/alumni/about";

  const { notificationCount, fetchNotificationCount } = useNotifications();

  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false);
      setAboutDropdownOpen(false);
      setMobileAboutDropdownOpen(false);
    };

    // Close menus when pathname changes
    handleRouteChange();

    return () => {
      // Cleanup
    };
  }, [pathname]);

  // Add effect to handle hash scrolling when the page loads
  useEffect(() => {
    // Check if there's a hash in the URL
    if (window.location.hash && isAboutPage) {
      // First scroll to top
      window.scrollTo(0, 0);

      // Then scroll to the section after a delay
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 800); // Longer delay to allow user to see the top of the page first
    }
  }, [isAboutPage]);

  useEffect(() => {
    fetchNotificationCount();
  }, [fetchNotificationCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target)) {
        setAboutDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Override default anchor behavior to use smooth scrolling
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;

      // Check if it's an internal hash link
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href').replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("alumni");
    router.push("/login");
  };

  // Helper function to handle intelligent section navigation
  const navigateToSection = (sectionId) => {
    if (isAboutPage) {
      // If already on about page, just scroll to the section
      const id = sectionId.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setAboutDropdownOpen(false);
      setMobileAboutDropdownOpen(false);
      setMenuOpen(false);
    } else {
      // If on another page, navigate to about page first, and let the useEffect handle scrolling
      // The hash will trigger the delayed scrolling after page load
      router.push(`/alumni/about/${sectionId}`);
    }
  };

  return (
    <header className={`${isDark ? 'bg-cyan-400 text-[#131A45]' : 'bg-custom-blue text-white'} p-4 flex justify-between items-center relative transition-colors duration-200`}>
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
        <Link href="/alumni/homepage" className={`${isDark ? 'text-[#131A45] hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          Home
        </Link>

        {/* About Us with Dropdown */}
        <div className="relative inline-block" ref={aboutDropdownRef}>
          <div
            className={`${isDark ? 'text-[#131A45] hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200 cursor-pointer inline-flex items-center`}
            onMouseEnter={() => setAboutDropdownOpen(true)}
          >
            <Link href="/alumni/about" className="inline-flex items-center">
              About ROBA
            </Link>
            <Icon icon="mdi:chevron-down" className="ml-1" width="18" height="18" />
          </div>

          {/* About Dropdown Menu */}
          {aboutDropdownOpen && (
            <div
              className={`absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg ${isDark ? 'bg-gray-100 text-[#131A45]' : 'bg-[#0F1536] text-white'} transition-colors duration-200`}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <div className="py-1">
                <Link
                  href="/alumni/about"
                  className={`block px-4 py-2 w-full text-left ${isDark ? 'hover:bg-gray-200' : 'hover:bg-[#2A3057]'} transition-colors duration-200`}
                >
                  Roba Objectives
                </Link>
                <Link
                  href="/alumni/about/robahistory"
                  className={`block px-4 py-2 w-full text-left ${isDark ? 'hover:bg-gray-200' : 'hover:bg-[#2A3057]'} transition-colors duration-200`}
                >
                  Roba History
                </Link>
                <Link
                  href="/alumni/about/presidentdesk"
                  className={`block px-4 py-2 w-full text-left ${isDark ? 'hover:bg-gray-200' : 'hover:bg-[#2A3057]'} transition-colors duration-200`}
                >
                  President Messages
                </Link>
                <Link
                  href="/alumni/about/managementcommittee"
                  className={`block px-4 py-2 w-full text-left ${isDark ? 'hover:bg-gray-200' : 'hover:bg-[#2A3057]'} transition-colors duration-200`}
                >
                  Management Committee
                </Link>
                <Link
                  href="/alumni/about/committeemembers"
                  className={`block px-4 py-2 w-full text-left ${isDark ? 'hover:bg-gray-200' : 'hover:bg-[#2A3057]'} transition-colors duration-200`}
                >
                  Committee Members
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link href="/alumni/events" className={`${isDark ? 'text-[#131A45] hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          Event
        </Link>
        <Link href="/alumni/members" className={`${isDark ? 'text-[#131A45] hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          Members
        </Link>
        <Link href="/alumni/contact" className={`${isDark ? 'text-[#131A45] hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          Contact
        </Link>
        <Link href="/alumni/souvenir_shop" className={`${isDark ? 'text-[#131A45] hover:text-gray-300' : 'text-white hover:text-gray-300'} transition-colors duration-200`}>
          Souvenir shop
        </Link>
      </nav>

      {/* Icons */}
      <div className="gap-3 hidden md:flex items-center">
        {/* Theme Toggle Button */}
        <div className="relative group">
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
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Toggle Theme
          </div>
        </div>

        {/* Chat Icon */}
        <div className="relative group">
          <Link
            href="/alumni/chat"
            className={`border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg ${isDark ? 'border-[#131A45] text-[#131A45]' : 'border-white text-white'
              } transition-colors duration-200`}
          >
            <Icon icon="iconoir:message" width="24" height="24" />
          </Link>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Chat
          </div>
        </div>

        {/* Notification Icon */}
        <div className="relative group">
          <Link
            href="/alumni/notification"
            className={`border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg ${isDark ? 'border-[#131A45] text-[#131A45]' : 'border-white text-white'
              } transition-colors duration-200`}
          >
            <Icon icon="line-md:bell" width="24" height="24" />
          </Link>
          {notificationCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </div>
          )}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Notifications
          </div>
        </div>

        {/* Profile Icon */}
        <div className="relative group">
          <Link
            href="/alumni/profile"
            className={`border-2 rounded-full p-2 flex justify-center items-center cursor-pointer hover:shadow-lg ${isDark ? 'border-[#131A45] text-[#131A45]' : 'border-white text-white'
              } transition-colors duration-200`}
          >
            <Icon icon="lucide:user" width="24" height="24" />
          </Link>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Profile
          </div>
        </div>
      </div>


      {/* Mobile Dropdown Menu */}
      <nav
        className={`absolute z-50 top-full left-0 w-full ${isDark ? 'bg-[#131A45] text-white' : 'bg-custom-blue text-white'
          } p-4 transform origin-top ${menuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          } transition-all duration-300 ease-in-out md:hidden`}
        style={{ transformOrigin: "top" }}
      >
        <ul className="flex flex-col text-end gap-4">
          <li>
            <Link
              href="/alumni/homepage"
              className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200`}
            >
              Home
            </Link>
          </li>
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
              {notificationCount > 0 && (
                <span className="mr-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
              Notification
            </Link>
          </li>

          {/* About Us with Dropdown in Mobile Menu */}
          <li className="flex flex-col items-end">
            <div className="flex items-center justify-end w-full">
              <Link
                href="/alumni/about"
                className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200`}
              >
                About ROBA
              </Link>
              <button
                onClick={() => setMobileAboutDropdownOpen(!mobileAboutDropdownOpen)}
                className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200 ml-2`}
                aria-label="Toggle about dropdown"
              >
                <Icon
                  icon={mobileAboutDropdownOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                  width="18"
                  height="18"
                />
              </button>
            </div>

            {/* Mobile About Dropdown Menu */}
            {mobileAboutDropdownOpen && (
              <div className="mt-2 flex flex-col items-end gap-2 pl-8 border-t border-gray-600 pt-2 w-full">
                <button
                  onClick={() => navigateToSection('#Objectives')}
                  className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200 text-sm py-2 text-right w-full`}
                >
                  Roba Objectives
                </button>
                <button
                  onClick={() => navigateToSection('#history')}
                  className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200 text-sm py-2 text-right w-full`}
                >
                  Roba History
                </button>
                <button
                  onClick={() => navigateToSection('#presidentmessage')}
                  className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200 text-sm py-2 text-right w-full`}
                >
                  President Messages
                </button>
                <button
                  onClick={() => navigateToSection('#managementcommittee')}
                  className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200 text-sm py-2 text-right w-full`}
                >
                  Management Committee
                </button>
                <button
                  onClick={() => navigateToSection('#committeemenbers')}
                  className={`${isDark ? 'hover:text-gray-300' : 'hover:text-gray-300'} transition-colors duration-200 text-sm py-2 text-right w-full`}
                >
                  Committee Members
                </button>
              </div>
            )}
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
                ? 'bg-[#2A3057] text-white hover:bg-gray-600'
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