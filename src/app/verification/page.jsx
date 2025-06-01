"use client";
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import { LetterText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import gettoken from "../function/gettoken";

export default function SignupPage() {
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_URL;
    const [verificationStatus, setVerificationStatus] = useState('checking');

    useEffect(() => {
        const checkVerification = async () => {
            try {
                const token = await gettoken();
                if (!token) {
                    toast.error("Login token not found.");
                    return;
                }

                const res = await fetch(`${url}/api/auth/check-token`, {
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

                // Set verification status based on both OTP and admin verification
                if (!data.user.isVerified) {
                    setVerificationStatus('otp_pending');
                } else if (data.user.status !== "verified") {
                    setVerificationStatus('admin_pending');
                } else {
                    setVerificationStatus('verified');
                    router.push("/alumni/homepage");
                }
            } catch (err) {
                console.error("Verification check error:", err);
                toast.error("Something went wrong.");
            }
        };

        checkVerification();
    }, [router]);

    // Render different content based on verification status
    const renderVerificationContent = () => {
        switch (verificationStatus) {
            case 'otp_pending':
                return (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">OTP Verification Required</h2>
                        <p>Please check your email for the OTP and complete the verification process.</p>
                    </div>
                );
            case 'admin_pending':
                return (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">Admin Verification Pending</h2>
                        <p>Your account is pending admin verification. We will notify you once it's approved.</p>
                    </div>
                );
            case 'verified':
                return (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">Account Verified</h2>
                        <p>Your account has been verified. Redirecting to homepage...</p>
                    </div>
                );
            default:
                return (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-4">Checking Verification Status</h2>
                        <p>Please wait while we check your verification status...</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <Logo />
                </div>
                {renderVerificationContent()}
            </div>
        </div>
    );
}
