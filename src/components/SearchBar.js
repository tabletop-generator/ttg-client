import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { createContext, useContext, useState } from "react";

// Create a context for search state
export const SearchContext = createContext({
  isSearchActive: false,
  setIsSearchActive: () => {},
});

// Hook to use search context
export const useSearch = () => useContext(SearchContext);

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleInputChange = (e) => setSearchTerm(e.target.value);

  const handleFocus = () => {
    setIsFocused(true);
    setIsSearchActive(true);
  };

  const handleBlur = (e) => {
    // Only deactivate search if clicking outside the search area
    // This way dropdowns can remain visible when using them
    setIsFocused(false);

    // We don't automatically hide features on blur
    // This will be controlled by the parent component
    // when appropriate (e.g., on search submission or cancel)
  };

  return (
    <SearchContext.Provider value={{ isSearchActive, setIsSearchActive }}>
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
          className={`w-full p-3 bg-transparent outline-none placeholder-gray-500 ${
            isFocused ? "text-white" : "text-gray-900"
          }`}
        />
      </div>
    </SearchContext.Provider>
  );
}
