export default function GradientOverlay({
  height = "50vh", // Match the height of the background image
  breakpoint1 = 40, // 40% solid black by default
  breakpoint2 = 100, // 100% transitions to 0% opacity
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

  // Generate gradient stops - from bottom to top for better overlay effect
  const gradient = `linear-gradient(to top, 
    rgba(0, 0, 0, 1) ${breakpoint1}%, 
    rgba(0, 0, 0, 0.7) ${breakpoint1 + 20}%, 
    rgba(0, 0, 0, 0) ${breakpoint2}%)`;

  return (
    <div
      className={`pointer-events-none absolute top-0 left-0 w-full z-10 ${className}`}
      style={{
        height,
        background: gradient,
      }}
    />
  );
}
