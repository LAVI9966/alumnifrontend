"use client";
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

export default function SignupPage() {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [isOtp, setIsotp] = React.useState(false);
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input if available
      if (value !== "" && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex ">
      <div className=" w-full ">
        <div className="relative">
          <div className="w-full h-64 ">
            <Image
              src="/topimg.png"
              alt="Hero Image"
              layout="fill"
              className="w-full h-full "
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center -mb-8">
            <Logo textwhite={false} />
          </div>
        </div>
        {!isOtp ? (
          <div className="w-full mx-auto my-10 max-w-[584px]">
            <div className="text-center">
              {/* <Logo /> */}
              <h2 className="text-2xl font-bold text-[#131A45]">
                Join the Rimcollian Alumni Network
              </h2>
              <p className="text-gray-500 mt-2 max-w-[374px] mx-auto">
                Reconnect, explore opportunities, and join our alumni community.
                Register now!
              </p>
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
                  Register
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-[#000000]">
              <p className="text-sm">
                Already have an account?{" "}
                <a href="/login" className="font-semibold underline">
                  Login
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full mx-auto mt-10 max-w-[584px]">
            <div className="text-center">
              {/* <Logo /> */}
              <h2 className="text-2xl font-bold text-[#131A45]">Enter OTP</h2>
              <p className="text-gray-500 mt-2 max-w-[374px] mx-auto">
                A 4-digit OTP has been sent to your registered mobile number or
                email. Please enter it below to verify your account.
              </p>
            </div>

            <div className="mt-8 space-y-4 mx-4">
              <div className="flex justify-center space-x-4   mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 custom-input  text-xl"
                  />
                ))}
              </div>

              <div className="mt-4 text-center text-[#000000]">
                <p className="text-sm">
                  Didn’t receive yet ?{" "}
                  <a href="#" className="font-semibold underline">
                    Resend OTP
                  </a>
                </p>
              </div>
              <div className="w-full flex justify-center">
                <Link
                  href="/profile"
                  type="submit"
                  className="w-[143px] text-center bg-[#131A45] text-white py-3 rounded-xl font-semibold hover:bg-[#1a2154]"
                >
                  Continue
                </Link>
              </div>
            </div>
            <div className="mt-4 text-center text-[#000000]">
              <p className="text-sm">
                Back to Register?{" "}
                <a href="/alumni/login" className="font-semibold underline">
                  Click Here
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
