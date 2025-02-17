import React from "react";
import { UserDataTable } from "./userTable";

const page = () => {
  return (
    <div className="mx-6 ">
      <h2 className="text-custom-blue font-semibold text-2xl">
        User Management
      </h2>
      <div className="flex gap-3 w-full mt-4 ">
        <UserDataTable />
      </div>
    </div>
  );
};

export default page;
