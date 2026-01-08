import React from "react";
import { FaDumbbell, FaUsers, FaHeartbeat } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar/>
      {/* -------- HERO SECTION -------- */}
      <section className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            About FitHub
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            FitHub is your all-in-one fitness management platform designed to
            connect users, trainers, and admins in one powerful ecosystem.
          </p>
        </div>
      </section>

      {/* -------- WHO WE ARE -------- */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              FitHub was created to simplify fitness management. Whether you are
              a fitness enthusiast, a professional trainer, or an administrator,
              FitHub gives you the tools you need to track progress, manage plans,
              and achieve goals efficiently.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe fitness should be structured, transparent, and
              accessible to everyone.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-700">
                <FaDumbbell className="text-blue-500" />
                Personalized fitness plans
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <FaUsers className="text-green-500" />
                Expert trainers & user management
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <FaHeartbeat className="text-red-500" />
                Health-focused goal tracking
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* -------- OUR MISSION -------- */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Our mission is to empower individuals and fitness professionals
            through technology. FitHub bridges the gap between trainers and
            users by offering structured plans, seamless communication, and
            real-time tracking in one unified platform.
          </p>
        </div>
      </section>

      {/* -------- WHY FIT HUB -------- */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Why Choose FitHub?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Smart Management
              </h3>
              <p className="text-gray-600">
                Manage users, trainers, subscriptions, and payments with ease.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Secure Platform
              </h3>
              <p className="text-gray-600">
                Role-based access ensures security for admins, trainers, and users.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Growth Focused
              </h3>
              <p className="text-gray-600">
                Track progress, improve performance, and stay motivated.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* -------- FOOTER CTA -------- */}
      <section className="bg-gray-900 text-white py-12 px-6">
        <Footer/>
      </section>

    </div>
  );
};

export default About;
