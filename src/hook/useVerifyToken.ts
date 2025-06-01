'use client';

import gettoken from "@/app/function/gettoken";
import { usePathname, useRouter } from "next/navigation";

import { useEffect, useState } from "react";

const useVerifyToken = () => {
  const router = useRouter();
  const pathname = usePathname();
  const url = process.env.NEXT_PUBLIC_URL;
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      // Skip verification for public routes
      if (pathname === "/login" || pathname === "/signup" || pathname === "/") {
        setIsChecking(false);
        return;
      }

      const storedData = localStorage.getItem("alumni");
      if (!storedData) {
        setIsChecking(false);
        router.push("/login");
        return;
      }

      try {
        const { token } = JSON.parse(storedData);
        if (!token) {
          setIsChecking(false);
          router.push("/login");
          return;
        }

        const response = await fetch(`${url}/api/auth/check-token`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          localStorage.removeItem("alumni");
          setIsChecking(false);
          router.push("/login");
          return;
        }

        const data = await response.json();

        // Check both OTP verification and admin verification
        if (!data.user.isVerified) {
          // If not OTP verified and not already on verification page, redirect to verification
          if (pathname !== "/verification") {
            router.push("/verification");
            return;
          }
        } else if (data.user.status !== "verified") {
          // If OTP verified but not admin verified, show pending message
          if (pathname !== "/verification") {
            router.push("/verification");
            return;
          }
        } else if (pathname === "/verification") {
          // If both verified and on verification page, redirect to homepage
          router.push("/alumni/homepage");
          return;
        }

        // If we're on login/signup page and token is valid, redirect to homepage
        if ((pathname === "/login" || pathname === "/signup") && response.ok) {
          router.push("/alumni/homepage");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        localStorage.removeItem("alumni");
        setIsChecking(false);
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    };

    verifyToken();
  }, [pathname, router]);

  return isChecking;
};

export default useVerifyToken;
