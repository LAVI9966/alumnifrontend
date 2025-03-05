"use client";
import AdminHeader from "@/components/admin/adminheader";
import AdminSidebar from "@/components/admin/sidebar";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("alumni");
    if (!storedData) {
      router.push("/login");
      return;
    }
    const { token, user } = JSON.parse(storedData);

    if (!token) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin") {
      router.push("/alumni/homepage");
    }
  }, [router]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while checking token
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1  min-h-screen overflow-y-scroll flex flex-col">
        <AdminHeader />
        <main className="p-6 bg-gray-100 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
