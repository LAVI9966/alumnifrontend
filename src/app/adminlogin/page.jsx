"use client";
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import captcha from "../../../public/captcha.png";
export default function page() {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div className="min-h-screen  bg-[#ffffff] flex ">
      <div className="w-full mx-auto my-auto p-6 max-w-[768px] shadow-sm shadow-slate-400 rounded-lg ">
        <div
          className="relative
                 h-20 w-20 mx-auto"
        >
          <Image
            src="/flash/logoimage.jfif"
            alt="Rimcollian Logo"
            fill
            className="rounded-full object-contain"
          />
        </div>

        <div className="text-center mt-3">
          {/* <Logo /> */}
          <h2 className="text-xl font-bold text-[#131A45]">Sign In</h2>
        </div>
        <form className="mt-8 space-y-4 max-w-[400px] px-2 mx-auto  ">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              className="custom-input mt-1 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>

            <div className="relative  mt-1">
              <input
                id="password"
                name="password"
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
          </div>

          <button
            type="submit"
            className="w-full  bg-[#131A45] text-white py-3 rounded-xl font-semibold hover:bg-[#1a2154]"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
