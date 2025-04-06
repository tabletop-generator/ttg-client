// src/components/SearchBar.js
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { createContext, useContext, useState } from "react";

// Create a context for search state
export const SearchContext = createContext({
  isSearchActive: false,
  setIsSearchActive: () => {},
  searchTerm: "",
  setSearchTerm: () => {},
  triggerSearch: () => {}, // New function to trigger search explicitly
  searchSubmitted: false,
});

// Hook to use search context
export const useSearch = () => useContext(SearchContext);

export default function SearchBar() {
  const {
    searchTerm,
    setSearchTerm,
    triggerSearch,
    isSearchActive,
    setIsSearchActive,
  } = useSearch();

  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);

    // Activate search features as soon as user starts typing
    if (e.target.value.trim()) {
      setIsSearchActive(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsSearchActive(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Handle key presses in the search input
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsSearchActive(false);
      setSearchTerm("");
      e.target.blur(); // Remove focus from the input
    } else if (e.key === "Enter") {
      // Trigger search on Enter key
      e.preventDefault();
      triggerSearch();
      console.log("Enter key pressed, triggering search for:", searchTerm);
    }
  };

  return (
    <div
      className={`relative flex items-center rounded-md border ${
        isFocused ? "border-white bg-gray-900" : "border-gray-300 bg-gray-200"
      } transition-colors duration-200 z-20`}
      style={{
        width: "80%", // Default width
        maxWidth: "40rem", // Limit width on large screens
      }}
    >
      <MagnifyingGlassIcon
        className={`h-5 w-5 mx-3 ${isFocused ? "text-white" : "text-gray-500"}`}
      />
      <input
        type="text"
        placeholder="Search creations"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full p-3 bg-transparent outline-none placeholder-gray-500 ${
          isFocused ? "text-white" : "text-gray-900"
        }`}
      />
      {/* Optional visual search button */}
      {searchTerm && (
        <button
          onClick={triggerSearch}
          className="p-2 mr-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-500"
        >
          Search
        </button>
      )}
    </div>
  );
}
