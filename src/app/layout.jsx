"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/app/alumni/notification/NotificationContext";
import { ChatNotificationProvider } from "@/context/ChatNotificationContext";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/ScrollToTop";
import Script from 'next/script';
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <Script
                    src="https://checkout.razorpay.com/v1/checkout.js"
                    strategy="beforeInteractive"
                />
            </head>
            <body className={inter.className}>
                <ThemeProvider>
                    <NotificationProvider>
                        <ChatNotificationProvider>
                            <CartProvider>
                                {/* <Header /> */}
                                {children}
                                {/* <Footer /> */}
                                <ScrollToTop />
                                <Toaster />
                            </CartProvider>
                        </ChatNotificationProvider>
                    </NotificationProvider>
                </ThemeProvider>
            </body>
        </html>
    );
} 