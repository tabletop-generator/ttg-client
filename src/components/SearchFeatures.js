// src/components/SearchFeatures.js
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "@/components/tailwindui/dropdown";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function SearchFeatures() {
  // State for filter selections
  const [sortOption, setSortOption] = useState("recent");
  const [timeOption, setTimeOption] = useState("all");
  const [assetTypes, setAssetTypes] = useState({
    character: false,
    environment: false,
    quest: false,
    map: false,
  });

  // State for advanced options visibility
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Toggle asset type selection
  const toggleAssetType = (type) => {
    setAssetTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // Handle sort option selection
  const handleSortSelect = (option) => {
    setSortOption(option);
  };

  // Handle time period selection
  const handleTimeSelect = (option) => {
    setTimeOption(option);
  };

  return (
    <div className="w-full flex flex-col gap-4 py-2">
      {/* Always Visible - Asset Type Checkboxes - No background, cleaner UI */}
      <div className="flex justify-center">
        <div className="px-6 py-2 w-full max-w-3xl">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {/* Checkboxes with more subtle styling */}
            {[
              { id: "character", label: "Character" },
              { id: "environment", label: "Environment" },
              { id: "quest", label: "Quest" },
              { id: "map", label: "Map" },
            ].map((type) => (
              <div key={type.id} className="flex items-center">
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
          onClick={() => setShowAdvanced(!showAdvanced)}
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
          {/* Sort By Dropdown - Using Catalyst Dropdown with custom styling */}
          <div className="w-36 sm:w-40">
            <Dropdown>
              <DropdownButton className="w-full justify-between bg-gray-900 border border-gray-700">
                <span className="text-sm">
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
                <DropdownItem onClick={() => handleSortSelect("recent")}>
                  Date (Recent)
                </DropdownItem>
                <DropdownItem onClick={() => handleSortSelect("oldest")}>
                  Date (Oldest)
                </DropdownItem>
                <DropdownItem onClick={() => handleSortSelect("name_asc")}>
                  Name (A-Z)
                </DropdownItem>
                <DropdownItem onClick={() => handleSortSelect("name_desc")}>
                  Name (Z-A)
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Time Period Dropdown - Using Catalyst Dropdown with custom styling */}
          <div className="w-36 sm:w-40">
            <Dropdown>
              <DropdownButton className="w-full justify-between bg-gray-900 border border-gray-700">
                <span className="text-sm">
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
                <DropdownItem onClick={() => handleTimeSelect("week")}>
                  Past Week
                </DropdownItem>
                <DropdownItem onClick={() => handleTimeSelect("month")}>
                  Past Month
                </DropdownItem>
                <DropdownItem onClick={() => handleTimeSelect("year")}>
                  Past Year
                </DropdownItem>
                <DropdownItem onClick={() => handleTimeSelect("all")}>
                  All Time
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}
