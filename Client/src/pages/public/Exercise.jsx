import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Exercise() {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const exercises = [
    // Cardio
    {
      name: "Jumping Jacks",
      category: "Cardio",
      description: "Boost heart rate and burn calories.",
      youtubeId: "iSSAk4XCsRA",
    },
    {
      name: "Burpees",
      category: "Cardio",
      description: "Full body cardio strength workout.",
      youtubeId: "TU8QYVW0gDU",
    },

    // Chest
    {
      name: "Push Ups",
      category: "Chest",
      description: "Strengthen chest and triceps.",
      youtubeId: "IODxDxX7oi4",
    },
    {
      name: "Wide Push Ups",
      category: "Chest",
      description: "Target outer chest muscles.",
      youtubeId: "Eh00_rniF8E",
    },

    // Back
    {
      name: "Pull Ups",
      category: "Back",
      description: "Build upper back strength.",
      youtubeId: "eGo4IYlbE5g",
    },
    {
      name: "Superman Hold",
      category: "Back",
      description: "Strengthen lower back muscles.",
      youtubeId: "z6PJMT2y8GQ",
    },

    // Lower Arms
   {
  name: "Forearm Workout",
  category: "Lower Arms",
  description: "Strengthen forearms and grip.",
  youtubeId: "EiRC80FJbHU",
},
 // Lower Legs
    {
      name: "Calf Raises",
      category: "Lower Legs",
      description: "Strengthen calves and ankles.",
      youtubeId: "YMmgqO8Jo-k",
    },

    // Neck
    {
      name: "Neck Stretch",
      category: "Neck",
      description: "Improve neck mobility and reduce pain.",
      youtubeId: "SedzswEwpPw",
    },
  ];

  const categories = ["All", "Cardio", "Chest", "Back", "Lower Arms", "Lower Legs", "Neck"];

  const filteredExercises =
    activeCategory === "All"
      ? exercises
      : exercises.filter((ex) => ex.category === activeCategory);

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-400 to-gray-600 px-3 sm:px-6 py-4 sm:py-6">
  {/* 🔙 Back to Home */}
  <div className="max-w-7xl mx-auto">
    <button
      onClick={() => navigate("/")}
      className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-orange-500 hover:text-blue-700 transition mb-4 sm:mb-6"
    >
      ← Back to Home
    </button>

    {/* Page Title */}
    <div className="text-center mb-6 sm:mb-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">
        Exercise Library
      </h1>
      <p className="text-sm sm:text-base text-indigo-600 mt-2 max-w-2xl mx-auto">
        Browse exercises by category and improve your fitness
      </p>
    </div>

    {/* Categories */}
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all
            ${
              activeCategory === cat
                ? "bg-green-600 text-white shadow-md scale-105"
                : "bg-white text-gray-700 hover:bg-gray-100 hover:shadow"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Exercise Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
      {filteredExercises.map((exercise, index) => (
        <div
          key={index}
          className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 flex flex-col"
        >
          <span className="text-[10px] sm:text-xs font-bold text-green-600 uppercase tracking-wide">
            {exercise.category}
          </span>

          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mt-1 sm:mt-2">
            {exercise.name}
          </h2>

          <p className="text-gray-600 text-xs sm:text-sm mt-2 flex-grow">
            {exercise.description}
          </p>

          <button
            onClick={() => setSelectedVideo(exercise.youtubeId)}
            className="mt-4 sm:mt-5 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:bg-red-700 transition"
          >
            ▶ Watch Video
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* 🎥 Video Modal */}
  {selectedVideo && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-4xl p-3 sm:p-5 relative shadow-2xl">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={() => setSelectedVideo(null)}
            className="text-xs sm:text-sm font-medium bg-gray-100 px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg hover:bg-gray-200 transition"
          >
            ← Back
          </button>

          <button
            onClick={() => setSelectedVideo(null)}
            className="text-lg sm:text-xl font-bold text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="aspect-video overflow-hidden rounded-lg sm:rounded-xl">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${selectedVideo}`}
            title="Exercise Video"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )}
</div>


  );
}
