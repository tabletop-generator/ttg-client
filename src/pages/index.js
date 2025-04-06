// pages/index.js
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

  // Use state for the search query and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
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

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // This effect adjusts the grid position based on search activity
  useEffect(() => {
    // If there's an active search, bring the grid up to show more results
    if (searchQuery || Object.values(searchFilters.assetTypes).some(Boolean)) {
      setGridPosition(20);
    } else {
      setGridPosition(100);
    }
  }, [searchQuery, searchFilters]);

  // When search is explicitly submitted (e.g., Enter key),
  // immediately use the current search term without debouncing
  useEffect(() => {
    if (searchSubmitted) {
      console.log("Search explicitly submitted with query:", searchQuery);
      setDebouncedSearchQuery(searchQuery);
    }
  }, [searchSubmitted, searchQuery]);

  // ONLY ONE RETURN STATEMENT - This was the issue!
  return (
    <SearchContext.Provider
      value={{
        isSearchActive: Boolean(searchQuery),
        setIsSearchActive: (value) => {
          if (!value) setSearchQuery("");
        },
        searchTerm: searchQuery,
        setSearchTerm: setSearchQuery,
        searchSubmitted: searchSubmitted,
        triggerSearch: () => setSearchSubmitted((prev) => !prev),
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
            searchQuery={debouncedSearchQuery}
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
