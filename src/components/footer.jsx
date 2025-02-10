import React from "react";
import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="bg-custom-blue text-white p-4 text-xs text-center">
      <div className="w-16  mx-auto mb-4">
        <Logo textwhite={true} isfooter={true} />{" "}
      </div>
      <p>&copy; 2025 ROBA. All rights reserved.</p>
      <div className="mt-2">
        <a href="#" className="text-white hover:underline mx-2">
          About
        </a>
        <a href="#" className="text-white hover:underline mx-2">
          Contact
        </a>
        <a href="#" className="text-white hover:underline mx-2">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
