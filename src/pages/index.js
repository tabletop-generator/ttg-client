// pages/index.js

import { useEffect, useState } from "react";
import GradientOverlay from "../components/GradientTransitionLarge";
import PinterestGrid from "../components/PinterestGrid";
import RotatingBackground from "../components/RotatingBackground";
import SearchBar, { useSearch } from "../components/SearchBar";
import SearchFeatures from "../components/SearchFeatures";

function Home() {
  const [gridPosition, setGridPosition] = useState(0);

  // Create ref for handling escape key to close search
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        // You could add logic here to close search features
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  return (
    <>
      {/* Hero Section with Background and Gradient - Constrained height */}
      <div className="relative px-8 h-[50vh]">
        {/* Background Image */}
        <RotatingBackground />

        {/* Gradient Overlay - Modified to ensure it doesn't extend down too far */}
        <GradientOverlay height="50vh" breakpoint1={40} breakpoint2={90} />

        {/* Content positioned over the background/gradient */}
        <div className="relative z-20 flex flex-col items-center space-y-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo_hero.png"
            alt="TTG logo"
            className="w-auto h-auto max-w-xs md:max-w-md mt-[calc(15vh+50px)]"
          />
          <div className="w-full flex justify-center">
            <SearchBarWithFeatures setGridPosition={setGridPosition} />
          </div>
        </div>
      </div>

      {/* Content below hero section (Pinterest Grid) - With animation */}
      <div
        className="bg-black text-white pt-0 -mt-12 relative z-30 transition-all duration-500 ease-out"
        style={{
          transform: `translateY(${gridPosition}px)`,
        }}
      >
        <PinterestGrid />
      </div>
    </>
  );
}

// Internal component to manage search state and features
function SearchBarWithFeatures({ setGridPosition }) {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      <SearchBar />

      {/* Use the search context created in SearchBar */}
      <SearchConsumer
        setGridPosition={setGridPosition}
        setShowFeatures={setShowFeatures}
      />

      {/* Conditionally render features */}
      {showFeatures && <SearchFeatures isSearchActive={showFeatures} />}
    </div>
  );
}

// Component to consume search context
function SearchConsumer({ setGridPosition, setShowFeatures }) {
  const { isSearchActive } = useSearch();

  // When search state changes, update the grid position
  useEffect(() => {
    if (isSearchActive) {
      // Move grid down when search is active
      setGridPosition(100);
      setShowFeatures(true);
    } else {
      // Move grid back up when search becomes inactive
      setGridPosition(0);

      // Hide features with a delay to allow animation
      const timeout = setTimeout(() => {
        setShowFeatures(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [isSearchActive, setGridPosition, setShowFeatures]);

  return null; // This component doesn't render anything
}

// Mark page as not requiring authentication
Home.protected = false;

export default Home;
