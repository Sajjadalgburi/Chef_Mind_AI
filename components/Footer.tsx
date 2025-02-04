import React from "react";

const Footer = () => {
  return (
    <footer className="w-full rounded-lg mx-auto bg-white/90 backdrop-blur-xl px-9 border-b shadow-md p-3">
      <div className="container mx-auto px-4">
        <p className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} Snap Cook. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
