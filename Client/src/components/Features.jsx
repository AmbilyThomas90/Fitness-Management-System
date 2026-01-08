import React from "react";
import { FaDumbbell, FaAppleAlt, FaChartLine, FaComments } from "react-icons/fa";

const features = [
  { icon: <FaDumbbell size={30} />, title: "Personal Training", desc: "Expert trainers to guide your workouts." },
  { icon: <FaAppleAlt size={30} />, title: "Nutrition Plans", desc: "Custom diet plans for your goals." },
  { icon: <FaChartLine size={30} />, title: "Progress Tracking", desc: "Monitor your improvements over time." },
  { icon: <FaComments size={30} />, title: "Secure Messaging", desc: "Chat with your trainers in-app." },
];

const Features = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded shadow text-center hover:shadow-lg transition flex flex-col items-center"
            >
              <div className="text-blue-500 mb-4">{f.icon}</div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-700">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
