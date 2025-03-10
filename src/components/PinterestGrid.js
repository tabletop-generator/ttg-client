// PinterestGrid.js

import { useEffect, useRef, useState } from "react";

export default function PinterestGrid() {
  // State to store images and control lazy loading
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const gridRef = useRef(null);

  // Calculate how many images to initially load based on viewport size
  const calculateInitialBatchSize = () => {
    // Base batch size on viewport dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Estimate roughly how many images should fill viewport plus a bit more
    // This is a simple heuristic, you might need to adjust based on actual image sizes
    let columns = 2; // Default for mobile

    if (viewportWidth >= 640) columns = 3; // sm breakpoint
    if (viewportWidth >= 768) columns = 4; // md breakpoint
    if (viewportWidth >= 1024) columns = 5; // lg breakpoint

    // Estimate rows (viewport height / estimated image height) + buffer
    // Assuming average image display height of ~300px with gaps
    const estimatedRows = Math.ceil(viewportHeight / 300) + 1;

    // Return estimated number of images needed
    return columns * estimatedRows;
  };

  // Load more images
  const loadImages = (count = 10) => {
    if (images.length >= 100) {
      setHasMore(false);
      return;
    }

    const newImages = Array(count)
      .fill(null)
      .map((_, index) => ({
        id: `${images.length + index + 1}-${Date.now()}`, // Placeholder unique ID until we plug in our backend
        src: `/placeholder/p0${((images.length + index) % 4) + 1}.png`,
      }));
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Initial load when component mounts
  useEffect(() => {
    if (initialLoad) {
      const batchSize = calculateInitialBatchSize();
      loadImages(batchSize);
      setInitialLoad(false);
    }
  }, [initialLoad]);

  // Scroll listener to trigger loading more images
  useEffect(() => {
    const handleScroll = () => {
      // Only load more if we're not in initial load and scrolled near bottom
      if (!initialLoad && hasMore) {
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;

        // Load more when user has scrolled to within 300px of the bottom
        if (windowHeight + scrollTop >= documentHeight - 300) {
          loadImages(10); // Load 10 more images
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [images, initialLoad, hasMore]);

  return (
    <div className="p-4" ref={gridRef}>
      {/* Responsive grid for images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative overflow-hidden rounded-lg shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={`Image ${image.id}`}
              className="h-full w-full object-cover"
              loading="eager" // Change from lazy to eager for initial viewport images
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
