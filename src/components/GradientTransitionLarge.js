import React from "react";

export default function GradientOverlay({
  height = "100vh", // Default height of the div
  breakpoint1 = 40, // 40% solid black by default
  breakpoint2 = 60, // 60% transitions to 0% opacity
  className = "", // Additional classes for styling
}) {
  // Validate breakpoints
  if (
    breakpoint1 < 0 ||
    breakpoint1 > 100 ||
    breakpoint2 < breakpoint1 ||
    breakpoint2 > 100
  ) {
    console.error(
      "Invalid breakpoints: Ensure 0 <= breakpoint1 <= breakpoint2 <= 100",
    );
    return null;
  }

  // Generate gradient stops
  const gradient = `linear-gradient(to top, rgba(0, 0, 0, 1) ${breakpoint1}%, rgba(0, 0, 0, 0) ${breakpoint2}%)`;

  return (
    <div
      className={`pointer-events-none absolute top-0 left-0 w-full ${className}`}
      style={{
        height,
        background: gradient,
      }}
    />
  );
}
