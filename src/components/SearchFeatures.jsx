// src/components/SearchFeatures.js
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/components/tailwindui/dropdown";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearch } from "./SearchBar";

export default function SearchFeatures({
  onFilterChange,
  onAdvancedOptionsToggle,
}) {
  // State for filter selections
  const [sortOption, setSortOption] = useState("recent");
  const [timeOption, setTimeOption] = useState("all");

  // Load asset types from localStorage or default to all selected
  const [assetTypes, setAssetTypes] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ttg_assetTypes");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved asset types:", e);
        }
      }
    }
    // Default to all types selected
    return {
      character: true,
      environment: true,
      quest: true,
      map: true,
    };
  });

  // State for advanced options visibility
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Store viewport height for responsive adjustments
  const [viewportHeight, setViewportHeight] = useState(0);
  // Track if we're on a small screen
  const [isMobileView, setIsMobileView] = useState(false);

  // Get search context
  const { isSearchActive } = useSearch();

  // Update viewport dimensions on resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateDimensions = () => {
      setViewportHeight(window.innerHeight);
      setIsMobileView(window.innerWidth < 640);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Memoize the filters object to prevent recreation on every render
  const filters = useMemo(
    () => ({
      sortBy: sortOption,
      timePeriod: timeOption,
      assetTypes,
    }),
    [sortOption, timeOption, assetTypes],
  );

  // Toggle asset type selection using a memoized callback
  const toggleAssetType = useCallback((type) => {
    setAssetTypes((prev) => {
      const newTypes = {
        ...prev,
        [type]: !prev[type],
      };

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("ttg_assetTypes", JSON.stringify(newTypes));
      }

      return newTypes;
    });
  }, []);

  // Handle sort option selection
  const handleSortSelect = useCallback((option) => {
    setSortOption(option);
  }, []);

  // Handle time period selection
  const handleTimeSelect = useCallback((option) => {
    setTimeOption(option);
  }, []);

  // Toggle advanced options
  const toggleAdvancedOptions = useCallback(() => {
    const newState = !showAdvanced;
    setShowAdvanced(newState);
    if (onAdvancedOptionsToggle) {
      onAdvancedOptionsToggle(newState);
    }
  }, [showAdvanced, onAdvancedOptionsToggle]);

  // Update parent component with filters when they change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]); // Only re-run when filters or onFilterChange changes

  // Calculate spacing based on viewport height
  const getResponsiveSpacing = () => {
    if (viewportHeight < 700) {
      return "py-1 gap-1 mt-3";
    } else if (viewportHeight < 900) {
      return "py-1 gap-2 mt-4";
    } else {
      return "py-2 gap-4 mt-5";
    }
  };

  const responsiveSpacing = getResponsiveSpacing();

  return (
    // Apply a class that sets all text to light colors and backgrounds to dark
    <div className={`w-full flex flex-col ${responsiveSpacing} text-white`}>
      {/* Always Visible - Asset Type Checkboxes - No background, cleaner UI */}
      <div className="flex justify-center">
        <div className="px-6 py-2 w-full max-w-3xl">
          {/* Responsive checkbox layout - vertical on small screens, horizontal on larger */}
          <div
            className={`${isMobileView ? "flex flex-col items-center" : "flex flex-wrap items-center justify-center gap-x-8 gap-y-2"}`}
          >
            {/* Checkboxes with more subtle styling */}
            {[
              { id: "character", label: "Character" },
              { id: "environment", label: "Environment" },
              { id: "quest", label: "Quest" },
              { id: "map", label: "Map" },
            ].map((type) => (
              <div
                key={type.id}
                className={`flex ${isMobileView ? "mb-3 w-40 items-start" : "items-center"}`}
              >
                <input
                  id={`filter-${type.id}`}
                  type="checkbox"
                  checked={assetTypes[type.id]}
                  onChange={() => toggleAssetType(type.id)}
                  className="h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`filter-${type.id}`}
                  className="ml-2 text-sm text-gray-400"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Options Toggle Button - More subtle styling */}
      <div className="flex justify-center">
        <button
          onClick={toggleAdvancedOptions}
          className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-1 rounded-md text-sm transition-colors duration-200"
        >
          {showAdvanced ? (
            <>
              <span>Hide Advanced Options</span>
              <ChevronUpIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Show Advanced Options</span>
              <ChevronDownIcon className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Advanced Options Section - with fixed positioning approach */}
      <div
        className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
          showAdvanced ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 rounded-lg max-w-3xl mx-auto">
          {/* Sort By Dropdown - Using Catalyst Dropdown with custom styling but forcing dark theme colors */}
          <div className="w-36 sm:w-40">
            <Dropdown>
              <DropdownButton className="w-full justify-between bg-gray-900 border border-gray-700">
                <span className="text-sm text-white">
                  Sort:{" "}
                  {sortOption === "recent"
                    ? "Recent"
                    : sortOption === "oldest"
                      ? "Oldest"
                      : sortOption === "name_asc"
                        ? "A-Z"
                        : "Z-A"}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </DropdownButton>
              <DropdownMenu
                anchor="bottom"
                className="!bg-gray-900 border border-gray-700 !w-36 sm:!w-40"
              >
                <DropdownItem
                  onClick={() => handleSortSelect("recent")}
                  className="text-white"
                >
                  Date (Recent)
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleSortSelect("oldest")}
                  className="text-white"
                >
                  Date (Oldest)
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleSortSelect("name_asc")}
                  className="text-white"
                >
                  Name (A-Z)
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleSortSelect("name_desc")}
                  className="text-white"
                >
                  Name (Z-A)
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Time Period Dropdown - Using Catalyst Dropdown with forced dark theme styling */}
          <div className="w-36 sm:w-40">
            <Dropdown>
              <DropdownButton className="w-full justify-between bg-gray-900 border border-gray-700">
                <span className="text-sm text-white">
                  Period:{" "}
                  {timeOption === "week"
                    ? "Week"
                    : timeOption === "month"
                      ? "Month"
                      : timeOption === "year"
                        ? "Year"
                        : "All Time"}
                </span>
                <ChevronDownIcon className="h-4 w-4" />
              </DropdownButton>
              <DropdownMenu
                anchor="bottom"
                className="!bg-gray-900 border border-gray-700 !w-36 sm:!w-40"
              >
                <DropdownItem
                  onClick={() => handleTimeSelect("week")}
                  className="text-white"
                >
                  Past Week
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleTimeSelect("month")}
                  className="text-white"
                >
                  Past Month
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleTimeSelect("year")}
                  className="text-white"
                >
                  Past Year
                </DropdownItem>
                <DropdownItem
                  onClick={() => handleTimeSelect("all")}
                  className="text-white"
                >
                  All Time
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
      {/* CSS to force dark mode styles regardless of browser/OS settings */}
      <style jsx global>{`
        /* This ensures the component always uses dark mode colors */
        .text-black,
        .text-zinc-950,
        .text-zinc-900,
        .text-zinc-800,
        .text-zinc-700 {
          color: white !important;
        }

        /* Force backgrounds to stay dark */
        .bg-white,
        .bg-zinc-50,
        .bg-zinc-100,
        .bg-zinc-200 {
          background-color: #1f2937 !important; /* bg-gray-900 equivalent */
        }

        /* Force dark borders */
        .border-zinc-300,
        .border-zinc-200,
        .border-zinc-100 {
          border-color: #374151 !important; /* border-gray-700 equivalent */
        }
      `}</style>
    </div>
  );
}
