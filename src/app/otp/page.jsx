"use client";
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import { LetterText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [otp, setOtp] = React.useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const url = process.env.NEXT_PUBLIC_URL;

  const router = useRouter();
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

  const verifyOtp = async () => {
    let myotp = "";
    if (otp.some((digit) => digit === "")) {
      toast.warning("please enter OTP");
      return;
    } else {
      myotp = otp.join("");
    }

    const storedData = localStorage.getItem("alumni");
    if (!storedData) {
      router.push("/signup");
      return;
    }

    try {
      const { token } = JSON.parse(storedData);
      const response = await fetch(`${url}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
        body: JSON.stringify({ otp: myotp }), // Send OTP in request body
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data?.message || "OTP verified successfully!");
        localStorage.removeItem("alumni");
        router.push("/verification");
      } else {
        toast.error(data?.message || "OTP verification failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
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
                  className="w-12 h-12 custom-input text-black text-xl"
                />
              ))}
            </div>
            {/* 
            <div className="mt-4 text-center text-[#000000]">
              <p className="text-sm">
                Didn’t receive yet ?{" "}
                <a href="#" className="font-semibold underline">
                  Resend OTP
                </a>
              </p>
            </div> */}
            <div className="w-full flex justify-center">
              <button
                onClick={verifyOtp}
                type="submit"
                className="w-[143px] text-center bg-[#131A45] text-white py-3 rounded-xl font-semibold hover:bg-[#1a2154]"
              >
                Continue
              </button>
            </div>
          </div>
          <div className="mt-4 text-center text-[#000000]">
            <p className="text-sm">
              Back to Register?{" "}
              <a href="/login" className="font-semibold underline">
                Click Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
