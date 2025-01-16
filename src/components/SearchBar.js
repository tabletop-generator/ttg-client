import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => setSearchTerm(e.target.value);

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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full p-3 bg-transparent outline-none placeholder-gray-500 ${
          isFocused ? "text-white" : "text-gray-900"
        }`}
      />
    </div>
  );
}
