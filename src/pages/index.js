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

  // State for grid positioning based on screen height
  const [gridPosition, setGridPosition] = useState(100);
  const [viewportHeight, setViewportHeight] = useState(0);

  // Use state for the search query and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    sortBy: "recent",
    timePeriod: "all",
    assetTypes: {
      character: true,
      environment: true,
      quest: true,
      map: true,
    },
  });

  // Track advanced options visibility separately
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Calculate appropriate grid position based on viewport height
  const calculateGridPosition = useCallback((height, showOptions) => {
    // Base positions
    let basePosition = 100;
    let collapsedPosition = 20;

    // Adjust for smaller screens
    if (height < 900) {
      // For very small screens
      basePosition = 300;
      collapsedPosition = 200;
    } else if (height < 1080) {
      // For 1080p screens
      basePosition = 180;
      collapsedPosition = 100;
    }

    return showOptions ? basePosition : collapsedPosition;
  }, []);

  // Track viewport height changes
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      setViewportHeight(vh);
      setGridPosition(calculateGridPosition(vh, showAdvancedOptions));
    };

    // Initial calculation
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [calculateGridPosition, showAdvancedOptions]);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // Increased from 300ms to 500ms for better debouncing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle search filter changes with useCallback to prevent infinite loops
  const handleFilterChange = useCallback((filters) => {
    console.log("Filters changed:", filters);
    setSearchFilters(filters);
  }, []);

  // Callback for when advanced options visibility changes
  const handleAdvancedOptionsToggle = useCallback(
    (isVisible) => {
      setShowAdvancedOptions(isVisible);
      if (typeof window !== "undefined") {
        setGridPosition(calculateGridPosition(window.innerHeight, isVisible));
      }
    },
    [calculateGridPosition],
  );

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

  // When search is explicitly submitted (e.g., Enter key),
  // immediately use the current search term without debouncing
  useEffect(() => {
    if (searchSubmitted) {
      console.log("Search explicitly submitted with query:", searchQuery);
      setDebouncedSearchQuery(searchQuery);
    }
  }, [searchSubmitted, searchQuery]);

  // Get responsive class names based on viewport height
  const getResponsiveClasses = () => {
    if (viewportHeight < 700) {
      return {
        logoClass: "max-w-xs md:max-w-xs mb-4",
        spacingClass: "pt-[10vh]",
      };
    } else if (viewportHeight < 900) {
      return {
        logoClass: "max-w-xs md:max-w-sm mb-6",
        spacingClass: "pt-[12vh]",
      };
    } else {
      return {
        logoClass: "max-w-xs md:max-w-md mb-8",
        spacingClass: "pt-[15vh]",
      };
    }
  };

  const { logoClass, spacingClass } = getResponsiveClasses();

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
          <div
            className={`relative px-8 flex flex-col items-center ${spacingClass} pb-4`}
          >
            {/* Logo with responsive sizing - removed tagline */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo_hero.png"
              alt="TTG logo"
              className={`w-auto h-auto ${logoClass}`}
            />

            {/* Search Components */}
            <div className="w-full flex justify-center">
              <div className="w-full flex flex-col items-center space-y-4">
                <SearchBar />
                <SearchFeatures
                  onFilterChange={handleFilterChange}
                  onAdvancedOptionsToggle={handleAdvancedOptionsToggle}
                />
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
