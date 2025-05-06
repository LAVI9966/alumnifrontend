import Image from "next/image";
import React from "react";
import { useTheme } from "@/context/ThemeProvider";
const Logo = ({ textwhite, isfooter }) => {
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  return (
    <div className="flex flex-col items-center max-w-[200px] w-full mx-auto">
      <div
        className={`relative ${isfooter ? "w-8 h-8 sm:w-12 sm:h-12" : "h-28 w-28"
          } `}
      >
        <Image
          src="/logoimage.png"
          alt="Rimcollian Logo"
          width="100"
          height="100"
          className="rounded-full object-contain"
        />
      </div>
      <hr
        className={`border-[#131A45] border-[1px] w-full ${isfooter ? "mt-1" : "mt-2"
          }`}
      />
      <hr
        className={`border-[#C7A006] border-[1px] w-[80%] ${isfooter ? "mt-1" : "mt-2"
          }`}
      />
      <div className={`${isDark ? 'bg-white text-[#131A45]' : 'bg-custom-blue text-white'}`}>

        Alumni

      </div>

    </div>
  );
};

export default Logo;
