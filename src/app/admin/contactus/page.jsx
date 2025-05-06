'use client'
import React from "react";
import { ContactDataTable } from "./contactTable";
import { useTheme } from "@/context/ThemeProvider";
const page = () => {
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  return (
    <div className="mx-6 ">
      <h2 className={`${isDark ? 'text-white' : 'text-[#131A45]'} font-semibold text-2xl`}>
        Contact Us
      </h2>
      <div className="flex gap-3 w-full mt-4 ">
        <ContactDataTable />
      </div>
    </div>
  );
};

export default page;
