import Image from "next/image";
import React from "react";

const Logo = ({ textwhite, isfooter }) => {
  return (
    <div className="flex flex-col items-center max-w-[200px] w-full mx-auto">
      <div
        className={`relative ${
          isfooter ? "w-8 h-8 sm:w-12 sm:h-12" : "h-28 w-28"
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
        className={`border-[#131A45] border-[1px] w-full ${
          isfooter ? "mt-1" : "mt-2"
        }`}
      />
      <hr
        className={`border-[#C7A006] border-[1px] w-[80%] ${
          isfooter ? "mt-1" : "mt-2"
        }`}
      />
      <p
        className={`${textwhite ? "text-[#ffffff]" : "text-[#131A45]"}  ${
          isfooter ? "text-[10px] sm:text-sm" : "text-2xl"
        } ${isfooter ? "p-0" : "p-2"}  font-medium`}
      >
        Alumni
      </p>
    </div>
  );
};

export default Logo;
