import { Icon } from "@iconify/react";

const AdminHeader = () => {
  return (
    <div className={"bg-white p-4  py-4 flex justify-between shadow-md"}>
      <p className="text-xl text-center w-full font-bold">Admin Dashboard</p>
      {/* Search Bar */}

      {/* <div className="p-2 bg-gray-100 flex items-center min-w-[352px] space-x-2 rounded-3xl mx-auto ">
          <Icon
            className="text-gray-500"
            icon="mynaui:search"
            width="24"
            height="24"
          />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 w-full outline-none"
          />
     
      </div> */}
    </div>
  );
};

export default AdminHeader;
