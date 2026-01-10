import React from "react";

const Hero = ({ openRegister, openPlanCard }) => {
  return (
    <section
      className="bg-cover bg-center h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[90vh]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1579758629939-035a4f8b7b41')",
      }}
    >
      <div className="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
          Achieve Your Fitness Goals
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl mb-6 px-2 sm:px-0">
          With Expert Trainers & Personalized Plans
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <button
            onClick={openRegister}
            className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600"
          >
            Get Started
          </button>

          {/* <button
            onClick={openPlanCard}
            className="bg-transparent border border-white px-6 py-2 rounded hover:bg-white hover:text-black"
          >
            View Plans
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
