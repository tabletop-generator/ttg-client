import Dropdown from "@/components/tailwindui/dropdown";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function SearchFeatures({ isSearchActive, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  // Watch for changes in the search active state
  useEffect(() => {
    if (isSearchActive) {
      // Add a small delay before showing to let the grid animation start first
      setTimeout(() => setIsVisible(true), 150);
    } else {
      setIsVisible(false);
    }
  }, [isSearchActive]);

  return (
    <div
      className={`w-full transition-all duration-750 ease-out flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 pb-2 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ transitionDelay: isVisible ? "250ms" : "0ms" }}
    >
      {/* Asset Type Dropdown */}
      <div className="w-full sm:w-auto">
        <Dropdown
          buttonContent={
            <span className="flex items-center">
              Asset Type <ChevronDownIcon className="h-4 w-4 ml-2" />
            </span>
          }
          items={[
            { label: "Character", onClick: () => {} },
            { label: "Location", onClick: () => {} },
            { label: "Quest", onClick: () => {} },
            { label: "Map", onClick: () => {} },
          ]}
          headerText="Select Asset Type"
        />
      </div>

      {/* Time Period Dropdown */}
      <div className="w-full sm:w-auto">
        <Dropdown
          buttonContent={
            <span className="flex items-center">
              Time Period <ChevronDownIcon className="h-4 w-4 ml-2" />
            </span>
          }
          items={[
            { label: "All Time", onClick: () => {} },
            { label: "Past Day", onClick: () => {} },
            { label: "Past Week", onClick: () => {} },
            { label: "Past Month", onClick: () => {} },
          ]}
          headerText="Select Time Period"
        />
      </div>
    </div>
  );
}
