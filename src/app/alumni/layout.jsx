"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Layout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("alumni");
    if (!storedData) {
      router.push("/login");
      return;
    }
    const { token } = JSON.parse(storedData);
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);
  return (
    <div className="min-h-screen   flex flex-col bg-gray-50">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
