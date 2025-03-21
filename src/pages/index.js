// pages/index.js

import { useEffect, useState } from "react";
import GradientOverlay from "../components/GradientTransitionLarge";
import PinterestGrid from "../components/PinterestGrid";
import RotatingBackground from "../components/RotatingBackground";
import SearchBar from "../components/SearchBar";
import SearchFeatures from "../components/SearchFeatures";

function Home() {
  // Start with a 100px offset to make room for search features
  const [gridPosition, setGridPosition] = useState(100);

  // Create ref for handling escape key to close search
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        // You could add logic here to cancel search
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  return (
    <div className="relative isolate">
      {/* Background and Gradient - Lowest layer */}
      <div className="relative z-0">
        {/* Background Image */}
        <div className="relative px-8 h-[50vh]">
          <RotatingBackground />
          <GradientOverlay height="50vh" breakpoint1={40} breakpoint2={90} />
        </div>
      </div>

      {/* Pinterest Grid - Middle layer */}
      <div
        className="bg-black text-white pt-0 -mt-12 relative z-10 transition-all duration-500 ease-out"
        style={{
          transform: `translateY(${gridPosition}px)`,
        }}
      >
        <PinterestGrid />
      </div>

      {/* Search UI - Top layer with proper stacking context */}
      <div className="absolute top-0 left-0 w-full z-20">
        <div className="relative px-8 flex flex-col items-center pt-[15vh] pb-4">
          {/* Logo */}
          <img
            src="/logo_hero.png"
            alt="TTG logo"
            className="w-auto h-auto max-w-xs md:max-w-md mb-8"
          />

          {/* Search Components */}
          <div className="w-full flex justify-center">
            <div className="w-full flex flex-col items-center space-y-4">
              <SearchBar />
              <SearchFeatures />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mark page as not requiring authentication
Home.protected = false;

export default Home;
