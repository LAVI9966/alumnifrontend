import React from "react";
import { EventDataTable } from "./eventTable";

const page = () => {
  return (
    <div className="mx-6 ">
      <h2 className="text-custom-blue font-semibold text-2xl">
      Event Management
      </h2>
      <div className="flex gap-3 w-full mt-4 ">
        <EventDataTable />
      </div>
    </div>
  );
};

export default page;
