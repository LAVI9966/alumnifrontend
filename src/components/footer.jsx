import React from "react";
import Logo from "./logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-custom-blue text-white p-4 text-xs text-center">
      <div className="w-16  mx-auto mb-4">
        <Logo textwhite={true} isfooter={true} />{" "}
      </div>
      <p>&copy; 2025 ROBA. All rights reserved.</p>
      <div className="mt-2">
        <Link href="about" className="text-white hover:underline mx-2">
          About
        </Link>
        <Link href="contact" className="text-white hover:underline mx-2">
          Contact
        </Link>
        <Link href="#" className="text-white hover:underline mx-2">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
