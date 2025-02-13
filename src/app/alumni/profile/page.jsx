"use client";
import { Icon } from "@iconify/react";
import React from "react";

const page = () => {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div className="min-h-screen bg-gray-100 pt-2 px-4 sm:p-4">
      <div className="w-full bg-white py-6 lg:p-8 rounded-lg mx-auto my-2 lg:my-8 max-w-[800px]">
        <div>
          <div className="m-auto relative w-40 h-40">
            <div className="w-full h-full rounded-full border-2 border-[#C7A006] flex items-center justify-center">
              <Icon icon="mynaui:user-solid" width="80%" height="80%" />
            </div>
            <div className="absolute bottom-2 right-2 bg-[#C7A006] p-2 rounded-full cursor-pointer">
              <Icon icon="typcn:camera" width="24" height="24" />
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-4 mx-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="College No. eg. 1407PS0262"
              className="custom-input  w-full"
            />
            <input
              type="text"
              placeholder="Full Name"
              className="custom-input  w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="john@example.com"
              className="custom-input  w-full"
            />
            <input
              type="tel"
              placeholder="9876541235"
              className="custom-input  w-full"
            />{" "}
          </div>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="*************"
              className="custom-input  w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-0 bottom-0 text-gray-500"
            >
              {passwordVisible ? (
                <Icon icon="uiw:eye-o" width="16" height="16" />
              ) : (
                <Icon icon="rivet-icons:eye-off" width="16" height="16" />
              )}
            </button>
          </div>
          <div className="w-full flex justify-center">
            <button
              onClick={() => setIsotp(true)}
              type="submit"
              className="w-[143px]  bg-[#131A45] text-white py-3 rounded-xl font-semibold hover:bg-[#1a2154]"
            >
              Save Changes
            </button>
          </div>
        </form>
        <div className="w-full flex justify-center">
          <button className="w-[143px] mt-3 border border-[#C7A006]  text-[#131A45]  py-2 rounded-xl font-semibold ">
            {" "}
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
