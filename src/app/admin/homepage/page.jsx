"use client";
import gettoken from "@/app/function/gettoken";
import Homepagecard from "@/components/admin/homepagecard";
import React from "react";
import toast from "react-hot-toast";

const page = () => {
  const [data, setData] = React.useState();
  const url = process.env.NEXT_PUBLIC_URL;
  React.useEffect(() => {
    getstats();
  }, []);

  const getstats = async () => {
    try {
      const token = await gettoken();

      const response = await fetch(`${url}/api/stats/users-stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });

      const data = await response.json();

      if (response.ok) {
        setData(data);
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
     
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="mx-6 ">
      <h2 className="text-custom-blue font-semibold text-2xl">Overview</h2>
      <div className="flex gap-3 w-full mt-4 ">
        <Homepagecard
          title="Total Alumnis"
          desc={data?.totalUsers}
          btnlink="manageusers"
        />
        <Homepagecard
          title="Total Events"
          desc={data?.totalEvents}
          btnlink="manageevent"
        />
      </div>
    </div>
  );
};

export default page;
