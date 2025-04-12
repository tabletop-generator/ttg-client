import { useEffect, useState } from "react";

export default function RotatingBackground() {
  const [backgroundImage, setBackgroundImage] = useState(1);

  // Set a random background image on component mount
  useEffect(() => {
    // Choose a random number between 1 and 4
    const randomImage = Math.floor(Math.random() * 4) + 1;
    setBackgroundImage(randomImage);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 w-full h-[50vh] bg-cover bg-center z-0"
      style={{
        backgroundImage: `url(/backgrounds/bg${backgroundImage}.jpg)`,
        marginTop: "-1.5rem", // Negative margin to offset the py-6 from Layout
      }}
    />
  );
}
