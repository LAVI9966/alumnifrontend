import React from "react";
import { ContactDataTable } from "./contactTable";

const page = () => {
  return (
    <div className="mx-6 ">
      <h2 className="text-custom-blue font-semibold text-2xl">
        Contact Us
      </h2>
      <div className="flex gap-3 w-full mt-4 ">
        <ContactDataTable />
      </div>
    </div>
  );
};

export default page;
