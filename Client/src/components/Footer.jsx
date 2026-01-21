import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
<div className="max-w-6xl mx-auto px-3 sm:px-5 lg:px- py-6 sm:py-8">
    {/* Top Section */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

     {/* About */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-white mb-4">
          Smart Fitness Suite
        </h2>
        <p className="text-sm sm:text-base leading-relaxed">
          Your ultimate platform to connect with expert trainers, track your
          fitness goals, and stay healthy.
        </p>
      </div>

      {/* Quick Links */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-white mb-4">
          Quick Links
        </h2>
        <ul className="space-y-3 text-sm sm:text-base">
          <li>
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Social */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-white mb-4">
          Follow Us
        </h2>
        <div className="flex justify-center sm:justify-start gap-4">
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center
                       rounded-full bg-gray-800
                       hover:bg-blue-600 text-gray-300 hover:text-white
                       transition"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center
                       rounded-full bg-gray-800
                       hover:bg-pink-600 text-gray-300 hover:text-white
                       transition"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center
                       rounded-full bg-gray-800
                       hover:bg-sky-500 text-gray-300 hover:text-white
                       transition"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center
                       rounded-full bg-gray-800
                       hover:bg-blue-700 text-gray-300 hover:text-white
                       transition"
          >
            <FaLinkedinIn size={18} />
          </a>
        </div>
      </div>

    </div>

    {/* Bottom */}
    <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Smart Fitness Suite. All rights reserved.
    </div>

  </div>
</footer>

  );
};

export default Footer;
