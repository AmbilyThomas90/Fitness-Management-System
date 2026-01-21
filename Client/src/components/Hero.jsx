import React from "react";

const Hero = ({ openRegister, openPlanCard }) => {
  return (
<section
  className="
    relative w-full
    min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] lg:min-h-[90vh]
    bg-cover bg-center bg-no-repeat
    flex items-center
  "
  style={{
    backgroundImage:
      "url(https://images.unsplash.com/photo-1751456357786-68c278e9063c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
  }}
>
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t 
                  from-black/30 via-black/20 to-black/30" />

  {/* Content */}
  <div className="
      relative z-10
      w-full max-w-7xl mx-auto
      h-full
      flex flex-col justify-center items-center
      text-center text-white
      px-4 sm:px-6 lg:px-8
    "
  >
    <h1 className="
        text-3xl sm:text-4xl md:text-5xl lg:text-6xl
        font-extrabold leading-tight tracking-tight
        mb-4 sm:mb-6
        drop-shadow-lg
      "
    >
      Achieve Your{" "}
      <span className="bg-gradient-to-r from-blue-400 to-cyan-400 
                       bg-clip-text text-transparent">
        Fitness Goals
      </span>
    </h1>

    <p className="
        max-w-xl sm:max-w-2xl
        text-base sm:text-lg md:text-xl
        text-gray-200
        mb-8 sm:mb-10
        drop-shadow-md
      "
    >
      Train with certified experts and follow personalized fitness plans
      designed for real results.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <button
        onClick={openRegister}
        className="
          px-8 py-3 sm:px-10 sm:py-4
          rounded-xl font-semibold
          bg-blue-600 hover:bg-blue-700
          shadow-lg shadow-blue-600/30
          transition-all duration-300
          hover:scale-105 active:scale-95
        "
      >
        Get Started
      </button>
    </div>
  </div>
</section>


  );
};

export default Hero;
