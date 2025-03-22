// pages/index.js - Complete revised version
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import GradientOverlay from "../components/GradientTransitionLarge";
import PinterestGrid from "../components/PinterestGrid";
import RotatingBackground from "../components/RotatingBackground";
import SearchBar, { SearchContext } from "../components/SearchBar";
import SearchFeatures from "../components/SearchFeatures";

function Home() {
  const auth = useAuth();

  // Start with a 100px offset to make room for search features
  const [gridPosition, setGridPosition] = useState(100);

  // Use useCallback for the filter change handler to prevent recreating it on every render
  const [searchFilters, setSearchFilters] = useState({
    sortBy: "recent",
    timePeriod: "all",
    assetTypes: {
      character: false,
      environment: false,
      quest: false,
      map: false,
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Handle search filter changes with useCallback to prevent infinite loops
  const handleFilterChange = useCallback((filters) => {
    console.log("Filters changed:", filters);
    setSearchFilters(filters);
  }, []);

  // Create ref for handling escape key to close search
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        // Reset search query
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isSearchActive: Boolean(searchQuery),
        setIsSearchActive: (value) => {
          if (!value) setSearchQuery("");
        },
        searchTerm: searchQuery,
        setSearchTerm: setSearchQuery,
      }}
    >
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
          <PinterestGrid
            searchQuery={searchQuery}
            filters={searchFilters}
            isAuthenticated={auth.isAuthenticated}
          />
        </div>

        {/* Search UI - Top layer with proper stacking context */}
        <div className="absolute top-0 left-0 w-full z-20">
          <div className="relative px-8 flex flex-col items-center pt-[15vh] pb-4">
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo_hero.png"
              alt="TTG logo"
              className="w-auto h-auto max-w-xs md:max-w-md mb-8"
            />

            {/* Search Components */}
            <div className="w-full flex justify-center">
              <div className="w-full flex flex-col items-center space-y-4">
                <SearchBar />
                <SearchFeatures onFilterChange={handleFilterChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SearchContext.Provider>
  );
}

// Mark page as not requiring authentication
Home.protected = false;

export default Home;
