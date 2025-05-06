import Link from "next/link";
import React from "react";
import { useTheme } from "@/context/ThemeProvider";
const Alumnihomepagecard = ({ title, desc, targetlink, buttonname }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-md shadow-md p-3 flex flex-col gap-1 ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white'}`}>
      <p className="font-bold ">{title}</p>
      <p className="text-[#797979]">{desc}</p>
      <Link
        href={targetlink}
        className={`w-[143px] text-sm mt-2 border text-center border-[#C7A006]  {isDark ? 'bg-[#131A45]/60 text-white' : 'bg-white'}]  py-2 rounded-xl font-semibold `}
      >
        {" "}
        {buttonname}
      </Link>
    </div>
  );
};

export default Alumnihomepagecard;
