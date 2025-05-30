"use client";
import React from "react";
import Logo from "./logo";
import Link from "next/link";
import { useTheme } from "@/context/ThemeProvider";
const Footer = () => {
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  return (
    <footer className={`bg-custom-blue text-white p-4 text-xs text-center ${isDark ? 'bg-white text-[#131A45]' : 'bg-custom-blue text-white'}`}>
      <div className={`w-16  mx-auto mb-4 hover:underline mx-2 ${isDark ? 'text-[#131A45]' : 'text-white'}`}>
        <Logo textwhite={true} isfooter={true} />{" "}
      </div>
      <p className={`hover:underline mx-2 ${isDark ? 'text-[#131A45]' : 'text-white'}`}>&copy; 2025 ROBA. All rights reserved.</p>
      <div className="mt-2">
        <Link href="about" className={`hover:underline mx-2 ${isDark ? 'text-[#131A45]' : 'text-white'}`}>
          About
        </Link>
        <Link href="contact" className={`hover:underline mx-2 ${isDark ? 'text-[#131A45]' : 'text-white'}`}>
          Contact
        </Link>
        <Link href="/alumni/privacypolicy" className={`hover:underline mx-2 ${isDark ? 'text-[#131A45]' : 'text-white'}`}>
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
