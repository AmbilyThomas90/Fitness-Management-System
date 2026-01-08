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
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r, index) => (
            <div
              key={index}
              className="bg-white rounded shadow p-6 hover:shadow-lg transition flex flex-col items-center"
            >
              <img
                src={r.img}
                alt={r.name}
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-gray-700 mb-4 px-2 sm:px-0">{r.feedback}</p>
              <h3 className="font-bold text-lg sm:text-xl">{r.name}</h3>
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
