"use client";
import AdminHeader from "@/components/admin/adminheader";
import AdminSidebar from "@/components/admin/sidebar";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import gettoken from "../function/gettoken";

const Layout = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const router = useRouter();

  // useEffect(() => {
  //   const storedData = localStorage.getItem("alumni");
  //   if (!storedData) {
  //     router.push("/login");
  //     return;
  //   }
  //   const { token, user } = JSON.parse(storedData);

  //   if (!token) {
  //     router.push("/login");
  //     return;
  //   }
  //   if (user.role !== "admin") {
  //     router.push("/alumni/homepage");
  //   }
  // }, [router]);

  const url = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    async function verifyToken() {
      const token = await gettoken();
      setLoading(true);
      if (!token) {
        console.error("No token found, redirecting to login.");
        localStorage.removeItem("alumni");
        router.push("/login");
        return;
      }
      try {
        const response = await fetch(`${url}/api/auth/check-token`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        
        if (!response.ok) {
          console.error("Invalid token:", data.message);
          localStorage.removeItem("alumni");
          router.push("/login");
        } else {
          if (data.user.role !== "admin") {
            router.push("/login");
          }
          setLoading(false);
        
        }
      } catch (error) {
        console.error("Error checking token:", error);
        localStorage.removeItem("alumni");
        router.push("/login");
      }
    }

    verifyToken();
  }, [router]);
  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking token
  }
  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1  min-h-screen overflow-y-scroll flex flex-col">
        <AdminHeader />
        <main className="p-6 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
