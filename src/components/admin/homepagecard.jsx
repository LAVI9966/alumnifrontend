import Link from "next/link";
import React from "react";
import { useTheme } from "@/context/ThemeProvider";
const Homepagecard = ({ title, desc, btnlink }) => {
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  return (
    <div className={`${isDark ? 'bg-[#2A3057]' : 'bg-white'}  rounded-lg shadow-md p-5 w-[206px] gap-2 flex flex-col`}>
      <p className="text-[#9E9E9E] text-sm">{title}</p>
      <p className=" text-3xl font-bold">{desc}</p>
      <Link
        href={btnlink}
        className="border-[1px] border-[#C7A006] p-1 text-center rounded-lg hover:shadow-md"
      >
        View
      </Link>
    </div>
  );
};

export default Homepagecard;
