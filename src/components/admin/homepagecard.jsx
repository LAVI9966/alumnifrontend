import Link from "next/link";
import React from "react";

const Homepagecard = ({ title, desc, btnlink }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-[206px] gap-2 flex flex-col">
      <p className="text-[#9E9E9E] text-sm">{title}</p>
      <p className="text-custom-blue text-3xl font-bold">{desc}</p>
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
