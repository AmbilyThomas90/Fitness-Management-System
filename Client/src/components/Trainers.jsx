import React from "react";

const sampleTrainers = [
  { name: "John Doe", specialty: "Strength Training", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Jane Smith", specialty: "Yoga & Flexibility", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Mike Lee", specialty: "Cardio & HIIT", img: "https://randomuser.me/api/portraits/men/56.jpg" },
];

const Trainers = () => {
  return (
    <section className="py-16 max-w-6xl mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
        Top Trainers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleTrainers.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition flex flex-col items-center"
          >
            <img
              src={t.img}
              alt={t.name}
              className="w-full h-64 sm:h-72 md:h-80 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="font-bold text-xl sm:text-2xl mb-2">{t.name}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{t.specialty}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trainers;
