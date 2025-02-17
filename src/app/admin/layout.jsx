"use client";
import AdminHeader from "@/components/admin/adminheader";
import AdminSidebar from "@/components/admin/sidebar";
import React from "react";

const Layout = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

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
