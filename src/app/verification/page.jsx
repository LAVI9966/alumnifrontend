"use client";
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import { LetterText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import gettoken from "../function/gettoken";
export default function SignupPage() {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_URL;
    useEffect(() => {
        const checkVerification = async () => {
            try {
                const token = await gettoken();
                console.log("token ", token)
                if (!token) {
                    toast.error("Login token not found.");
                    return;
                }

                const res = await fetch(`${url}/api/profile`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data?.message || "Failed to fetch user profile.");
                    return;
                }

                if (data.user?.status === "verified") {
                    router.push("/alumni/homepage"); // ✅ Redirect if verified
                }
            } catch (err) {
                console.error("Verification check error:", err);
                toast.error("Something went wrong.");
            }
        };

        checkVerification();
    }, [router]);

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

                        <p className="text-gray-500 mt-2 max-w-[374px] mx-auto">
                            Your account is currently unverified. We will notify you by email once it has been approved by the admins. After verification, you will be able to log in.
                        </p>
                    </div>


                </div>
            </div>
        </div>
    );
}
