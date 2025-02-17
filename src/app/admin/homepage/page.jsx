import Homepagecard from "@/components/admin/homepagecard";
import React from "react";

const page = () => {
  return (
    <div className="mx-6 ">
      <h2 className="text-custom-blue font-semibold text-2xl">Overview</h2>
      <div className="flex gap-3 w-full mt-4 ">
        <Homepagecard title="Total Alumnis" desc="324" btnlink="#" />
        <Homepagecard title="Total Alumnis" desc="324" btnlink="#" />
        <Homepagecard title="Total Alumnis" desc="324" btnlink="#" />
        <Homepagecard title="Total Alumnis" desc="324" btnlink="#" />
      </div>
    </div>
  );
};

export default page;
