// components/OptimizedImage.js
import Image from "next/image";
import { useEffect, useState } from "react";

// Cache management
const IMAGE_CACHE_PREFIX = "ttg_image_";
const IMAGE_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const getImageFromCache = (imageId) => {
  if (typeof window === "undefined") return null;
  try {
    const cacheKey = `${IMAGE_CACHE_PREFIX}${imageId}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (!cachedData) return null;

    const { imageUrl, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp > IMAGE_CACHE_EXPIRY) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    return imageUrl;
  } catch (error) {
    console.error("Error reading from image cache:", error);
    return null;
  }
};

export const saveImageToCache = (imageId, imageUrl) => {
  if (typeof window === "undefined" || !imageId || !imageUrl) return;
  try {
    const cacheKey = `${IMAGE_CACHE_PREFIX}${imageId}`;
    const cacheData = JSON.stringify({
      imageUrl,
      timestamp: Date.now(),
    });
    localStorage.setItem(cacheKey, cacheData);
  } catch (error) {
    console.error("Error saving to image cache:", error);
  }
};

// Default placeholder for blurhash effect
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23222'/%3E%3C/svg%3E";

export default function OptimizedImage({
  src,
  alt,
  width = 300,
  height = 300,
  fill = false,
  className = "",
  priority = false,
  quality = 75,
  onClick,
  imageId,
  objectFit = "cover",
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(src || "/placeholder/p01.png");
  const [isLoading, setIsLoading] = useState(!src);

  // Try to use cached version first
  useEffect(() => {
    if (imageId) {
      const cachedSrc = getImageFromCache(imageId);
      if (cachedSrc) {
        setImageSrc(cachedSrc);
        setIsLoading(false);
      } else if (src) {
        // Save to cache for future use
        saveImageToCache(imageId, src);
      }
    }
  }, [imageId, src]);

  // Handle image load error
  const handleError = () => {
    console.warn(`Failed to load image: ${src}`);
    setImageSrc("/placeholder/p01.png");
    setIsLoading(false);
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      {fill ? (
        <Image
          src={imageSrc}
          alt={alt || "Image"}
          fill={true}
          quality={quality}
          priority={priority}
          placeholder="blur"
          blurDataURL={PLACEHOLDER}
          onError={handleError}
          style={{ objectFit }}
          {...props}
        />
      ) : (
        <Image
          src={imageSrc}
          alt={alt || "Image"}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          placeholder="blur"
          blurDataURL={PLACEHOLDER}
          onError={handleError}
          style={{ objectFit }}
          {...props}
        />
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-40">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
