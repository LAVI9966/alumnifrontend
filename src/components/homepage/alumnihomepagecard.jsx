import Link from "next/link";
import React from "react";

const Alumnihomepagecard = ({ title, desc, targetlink, buttonname }) => {
  return (
    <div className="rounded-md bg-white shadow-md p-3 flex flex-col gap-1">
      <p className="font-bold ">{title}</p>
      <p className="text-[#797979]">{desc}</p>
      <Link
        href={targetlink}
        className="w-[143px] text-sm mt-2 border text-center border-[#C7A006]  text-[#131A45]  py-2 rounded-xl font-semibold "
      >
        {" "}
        {buttonname}
      </Link>
    </div>
  );
};

export default Alumnihomepagecard;
