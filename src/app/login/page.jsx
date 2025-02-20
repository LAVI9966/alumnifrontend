"use client";
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import captcha from "../../../public/captcha.png";
export default function SignupPage() {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div className="min-h-screen bg-[#ffffff] flex ">
      <div className=" w-full  mb-10">
        <div className="relative">
          <div className="w-full h-64 ">
            <Image
              src="/topimg.png" // Replace with your image path
              alt="Hero Image"
              layout="fill"
              className="w-full h-full "
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center -mb-8">
            <Logo textwhite={false} />
          </div>
        </div>
        <div className="w-full mx-auto mt-10 max-w-[584px]">
          <div className="text-center">
            {/* <Logo /> */}
            <h2 className="text-2xl font-bold text-[#131A45]">
              Welcome Back, Rimcollian!
            </h2>
            <p className="text-gray-500 mt-2 max-w-[374px] mx-auto">
              Log in to reconnect and access alumni resources.
            </p>
          </div>

          <form className="mt-8 space-y-4 max-w-[400px] px-2 mx-auto  ">
            <input
              type="email"
              placeholder="john@example.com"
              className="custom-input  w-full"
            />

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
            <div className=" flex justify-center">
              <Image src={captcha} alt="captcha" />
            </div>
            <div className="mt-4 text-center text-[#000000]">
              <p className="text-sm">
                Forgot Password ?{" "}
                <Link href="#" className="font-semibold underline">
                  click here
                </Link>
              </p>
            </div>
            <div className="w-full flex justify-center">
              {/* <button
                type="submit"
                className="w-[143px]  bg-[#131A45] text-white py-3 rounded-xl font-semibold hover:bg-[#1a2154]"
              >
                Login
              </button> */}
              <Link
                href="/profile"
                className="w-[143px]  text-center bg-[#131A45] text-white py-3 rounded-xl font-semibold hover:bg-[#1a2154]"
              >
                Login
              </Link>
            </div>
          </form>
          <div className="mt-4 text-center text-[#000000]">
            <p className="text-sm">
              New User ?{" "}
              <Link href="/signup" className="font-semibold underline">
                Register Now
              </Link>
            </p>
            <button className="border mt-3 border-[#C7A006] rounded-lg w-36 p-1">
              {" "}
              Need Help ?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
