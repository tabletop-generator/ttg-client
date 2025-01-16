import React, { useState, useEffect } from "react";

export default function PinterestGrid() {
  // State to store images and control lazy loading
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // Load more images
  const loadImages = () => {
    if (images.length >= 100) {
      setHasMore(false);
      return;
    }

    const newImages = Array(10) // Load 10 images at a time
      .fill(null)
      .map((_, index) => ({
        id: images.length + index + 1,
        src: `/placeholder/p0${((images.length + index) % 4) + 1}.png`,
      }));
    setImages((prevImages) => [...prevImages, ...newImages]); //spread operator is my best friend fr
  };

  // Scroll listener to trigger loading more images
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        loadImages();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images]);

  return (
    <div className="p-4">
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            className="relative overflow-hidden rounded-lg shadow-md"
          >
            <img
              src={image.src}
              alt={`Image ${image.id}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {!hasMore && (
        <div className="mt-4 text-center text-gray-500">
          <p>No more images to load!</p>
        </div>
      )}
    </div>
  );
}
