import React from "react";
import { FaDumbbell, FaAppleAlt, FaChartLine, FaComments } from "react-icons/fa";

const features = [
  { icon: <FaDumbbell size={30} />, title: "Personal Training", desc: "Expert trainers to guide your workouts." },
  { icon: <FaAppleAlt size={30} />, title: "Nutrition Plans", desc: "Custom diet plans for your goals." },
  { icon: <FaChartLine size={30} />, title: "Progress Tracking", desc: "Monitor your improvements over time." },
  { icon: <FaChartLine size={30} />, title: "Smart Workout Planning", desc: "Adaptive workout plans that evolve as you gain strength and endurance." }




];

const Features = () => {
  return (
<section className="py-16 sm:py-20 lg:py-24 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Section Header */}
    <div className="text-center mb-12 sm:mb-14 lg:mb-16">
      <h2 className="
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl
          font-extrabold tracking-tight
          text-gray-900 dark:text-white
        "
      >
        Our <span className="text-blue-600 dark:text-blue-400">Features</span>
      </h2>

      <p className="
          mt-4 max-w-xl sm:max-w-2xl mx-auto
          text-sm sm:text-base md:text-lg
          text-gray-600 dark:text-gray-300
        "
      >
        Everything you need to train smarter, stay motivated, and achieve
        lasting results.
      </p>
    </div>

    {/* Features Grid */}
    <div className="
        grid grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-6 sm:gap-8 
      "
    >
      {features.map((f, i) => (
        <div
          key={i}
          className="
            group bg-slate-100 dark:bg-slate-900
            p-6 sm:p-8
            rounded-2xl
            border border-gray-200 dark:border-slate-700
            text-center flex flex-col items-center
            shadow-sm hover:shadow-xl
            transition-all duration-300
            hover:-translate-y-2
          "
        >
          {/* Icon */}
          <div className="
              mb-5
              flex items-center justify-center
              w-12 h-12 sm:w-14 sm:h-14
              rounded-xl
              bg-blue-50 dark:bg-blue-500/10
              text-blue-600 dark:text-blue-400
              group-hover:bg-blue-600
              group-hover:text-white
              transition-all duration-300
            "
          >
            {f.icon}
          </div>

          {/* Title */}
          <h3 className="
              font-semibold
              text-base sm:text-lg md:text-xl
              mb-2
              text-gray-900 dark:text-white
            "
          >
            {f.title}
          </h3>

          {/* Description */}
          <p className="
              text-gray-600 dark:text-gray-300
              text-sm sm:text-base
              leading-relaxed
            "
          >
            {f.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>


  );
};

export default Features;
