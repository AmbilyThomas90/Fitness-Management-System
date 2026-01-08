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
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* -------- About Section -------- */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold mb-4">FitHub</h2>
          <p className="text-gray-400">
            Your ultimate platform to connect with expert trainers, track your
            fitness goals, and stay healthy.
          </p>
        </div>

        {/* -------- Quick Links -------- */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>
            {/* <li>
              <Link to="/trainers" className="hover:text-white transition">
                Trainers
              </Link>
            </li>
            <li>
              <Link to="/plans" className="hover:text-white transition">
                Plans
              </Link>
            </li> */}
            <li>
              <Link to="/about" className="hover:text-white transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* -------- Social Media -------- */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold mb-4">Follow Us</h2>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

      </div>

      {/* -------- Bottom -------- */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} FitHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
