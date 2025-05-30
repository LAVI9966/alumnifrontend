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
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/check-token`, {
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
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const { useTheme } = require("@/context/ThemeProvider");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`flex h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-white text-[#131A45]'}`}>
      <AdminSidebar />
      <div className="flex-1 min-h-screen overflow-y-scroll flex flex-col">
        <AdminHeader />
        <main className={`p-6 flex-1 ${isDark ? 'bg-[#232B4A]' : 'bg-[#F2F2F2]'}`}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
