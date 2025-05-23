import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from "./alumni/notification/NotificationContext";
import 'react-image-gallery/styles/css/image-gallery.css';
import { ThemeProvider } from "@/context/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Alumni Portal",
  description: "Alumni Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="/logoimage.png"
          type="image/png"
        />
      </Head>
      <body cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>

          <NotificationProvider>

            {children}

            <Toaster />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
