import Footer from "@/components/footer";
import Header from "@/components/header";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen  flex flex-col bg-gray-50">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
