import React from "react";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    name: "Alice Johnson",
    feedback: "The trainers are amazing! My fitness journey has never been easier.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
  {
    name: "Mark Smith",
    feedback: "I love the nutrition plans and progress tracking. Highly recommend!",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
  },
  {
    name: "Sophia Lee",
    feedback: "Secure messaging with trainers makes communication super easy.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
];

const Reviews = () => {
  return (
<section className="py-8 sm:py-12 lg:py-16 bg-gray-100 dark:bg-slate-900">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

    {/* Section Header */}
    <div className="mb-12 sm:mb-16">
      <h2 className="
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl
          font-extrabold tracking-tight
          text-gray-900 dark:text-white
        "
      >
        What Our <span className="text-blue-600 dark:text-blue-400">Users Say</span>
      </h2>

      <p className="
          mt-4 max-w-xl mx-auto
          text-sm sm:text-base md:text-lg
          text-gray-600 dark:text-gray-300
        "
      >
        Real experiences from people who transformed their fitness journey.
      </p>
    </div>

    {/* Reviews Grid */}
    <div className="
        grid grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-6 sm:gap-8
      "
    >
      {reviews.map((r, index) => (
        <div
          key={index}
          className="
            group bg-white dark:bg-slate-800
            rounded-2xl p-6 sm:p-8
            border border-gray-200 dark:border-slate-700
            shadow-sm hover:shadow-xl
            transition-all duration-300
            hover:-translate-y-2
            flex flex-col items-center
          "
        >
          {/* Avatar */}
          <img
            src={r.img}
            alt={r.name}
            className="
              w-16 h-16 sm:w-18 sm:h-18
              rounded-full
              object-cover
              mb-4
              ring-4 ring-blue-100 dark:ring-blue-500/20
            "
          />

          {/* Feedback */}
          <p className="
              text-gray-600 dark:text-gray-300
              text-sm sm:text-base
              leading-relaxed
              mb-4
              px-2 sm:px-0
            "
          >
            “{r.feedback}”
          </p>

          {/* Name */}
          <h3 className="
              font-semibold
              text-base sm:text-lg
              text-gray-900 dark:text-white
            "
          >
            {r.name}
          </h3>

          {/* Rating */}
          <div className="flex justify-center mt-2 text-yellow-400">
            {Array.from({ length: r.rating }).map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default Reviews;
