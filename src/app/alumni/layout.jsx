"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import gettoken from "../function/gettoken";
import ScrollToTop from "@/components/ScrollToTop";
import { ChatNotificationProvider } from "@/context/ChatNotificationContext";
import { NotificationProvider } from "./notification/NotificationContext";
const Layout = ({ children }) => {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    async function verifyToken() {
      const token = await gettoken();
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
        }
      } catch (error) {

        console.error("Error checking token:", error);
        localStorage.removeItem("alumni");
        router.push("/login");
      }
    }

    verifyToken();
  }, [router]); // Include router in dependencies
  return (
    <ChatNotificationProvider>
      <NotificationProvider>
        <div className="min-h-screen   flex flex-col bg-gray-50">
          <Header />
          {children}
          <ScrollToTop></ScrollToTop>
          <Footer />
        </div>
      </NotificationProvider>
    </ChatNotificationProvider>
  );
};

export default Layout;
