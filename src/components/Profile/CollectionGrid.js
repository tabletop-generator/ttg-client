// src/components/Profile/CollectionGrid.js
import {
  getAssetByID,
  getCollectionById,
  getUser,
  postCollection,
} from "@/api";
import CreateCollectionForm from "@/components/Profile/CreateCollectionForm";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

// Cache key prefix for localStorage
const IMAGE_CACHE_PREFIX = "collection_image_";
const IMAGE_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function CollectionGrid({
  user,
  setUser,
  collections,
  onCollectionClick,
  isOwnProfile = true,
}) {
  const auth = useAuth();
  const router = useRouter();
  const cognitoUser = auth.user;
  const [isCreating, setIsCreating] = useState(false);

  // State to hold the image URLs for each collection
  const [collectionBgImages, setCollectionBgImages] = useState({});
  // Track which collections are still loading
  const [loadingCollections, setLoadingCollections] = useState(new Set());
  const [loadError, setLoadError] = useState(null);

  // Load image from cache if available
  const getImageFromCache = useCallback((collectionId) => {
    if (typeof window === "undefined") return null;

    try {
      const cacheKey = `${IMAGE_CACHE_PREFIX}${collectionId}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (!cachedData) return null;

      const { imageUrl, timestamp } = JSON.parse(cachedData);

      // Check if cache has expired
      if (Date.now() - timestamp > IMAGE_CACHE_EXPIRY) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return imageUrl;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  }, []);

  // Save image to cache
  const saveImageToCache = useCallback((collectionId, imageUrl) => {
    if (typeof window === "undefined" || !collectionId || !imageUrl) return;

    try {
      const cacheKey = `${IMAGE_CACHE_PREFIX}${collectionId}`;
      const cacheData = JSON.stringify({
        imageUrl,
        timestamp: Date.now(),
      });
      localStorage.setItem(cacheKey, cacheData);
    } catch (error) {
      console.error("Error saving to cache:", error);
    }
  }, []);

  // Fetch a single collection's image with error handling
  const fetchSingleCollectionImage = useCallback(
    async (collection) => {
      if (!collection?.id || !cognitoUser?.id_token) return null;

      // Mark this collection as loading
      setLoadingCollections((prev) => new Set([...prev, collection.id]));

      try {
        // First check if we already have image data in the collection
        if (collection.assets?.[0]?.imageUrl) {
          const imageUrl = collection.assets[0].imageUrl;
          saveImageToCache(collection.id, imageUrl);
          return imageUrl;
        }

        // Otherwise make API call to get collection details
        const colResponse = await getCollectionById(cognitoUser, collection.id);

        if (colResponse?.collection?.assets?.length > 0) {
          const assetEntry = colResponse.collection.assets[0];
          const uuid =
            typeof assetEntry === "string" ? assetEntry : assetEntry.uuid;

          // Only fetch the asset details if we have a UUID
          if (uuid) {
            const assetResponse = await getAssetByID(cognitoUser, uuid);
            if (assetResponse?.data?.asset?.imageUrl) {
              const imageUrl = assetResponse.data.asset.imageUrl;
              saveImageToCache(collection.id, imageUrl);
              return imageUrl;
            }
          }
        }

        return null;
      } catch (error) {
        console.error(
          `Error fetching image for collection ${collection.id}:`,
          error,
        );
        if (error.status === 429) {
          throw new Error("Rate limit exceeded");
        }
        return null;
      } finally {
        // Remove this collection from loading state
        setLoadingCollections((prev) => {
          const newSet = new Set([...prev]);
          newSet.delete(collection.id);
          return newSet;
        });
      }
    },
    [cognitoUser, saveImageToCache],
  );

  // Load collection images with caching and rate limit protection
  useEffect(() => {
    if (!collections?.length || !cognitoUser?.id_token) return;

    const loadCollectionImages = async () => {
      setLoadError(null);

      // Process collections one by one to avoid rate limits
      for (const collection of collections) {
        if (!collection.id) continue;

        // Check cache first
        const cachedImage = getImageFromCache(collection.id);

        if (cachedImage) {
          // Use cached image without API call
          setCollectionBgImages((prev) => ({
            ...prev,
            [collection.id]: cachedImage,
          }));
          continue;
        }

        // If not in cache, fetch it (with delay between requests)
        try {
          const imageUrl = await fetchSingleCollectionImage(collection);

          if (imageUrl) {
            setCollectionBgImages((prev) => ({
              ...prev,
              [collection.id]: imageUrl,
            }));
          }

          // Add a small delay between requests to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (error) {
          if (error.message === "Rate limit exceeded") {
            setLoadError("Rate limit exceeded. Please try again later.");
            break;
          }
        }
      }
    };

    loadCollectionImages();
  }, [collections, cognitoUser, fetchSingleCollectionImage, getImageFromCache]);

  // Handle collection creation
  const handleCreateCollection = async (newCollection) => {
    if (!user || !cognitoUser) {
      console.error(
        "Missing user info. Cannot create collection without both user sources.",
      );
      setIsCreating(false);
      return;
    }

    try {
      const response = await postCollection(cognitoUser, newCollection);

      if (response && response.data) {
        const updatedUserResponse = await getUser(
          cognitoUser,
          user.hashedEmail,
        );
        if (updatedUserResponse?.data?.user) {
          setUser(updatedUserResponse.data.user);
          router.replace(router.asPath);
        }
      } else {
        console.error("Error: No data in response", response);
      }
    } catch (error) {
      console.error("Error posting collection:", error);
    }

    setIsCreating(false);
  };

  return (
    <div>
      {/* Show load error if present */}
      {loadError && (
        <div className="bg-red-600 text-white p-3 rounded-lg mb-4">
          <p>{loadError}</p>
        </div>
      )}

      {/* Create Collection Button - Only shown for profile owner */}
      {isOwnProfile && !isCreating && (
        <div className="mb-4">
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 shadow-md"
          >
            Create Collection
          </button>
        </div>
      )}

      {/* Show Create Collection Form or Collections Grid */}
      {isOwnProfile && isCreating ? (
        <CreateCollectionForm
          onCancel={() => setIsCreating(false)}
          onCreate={handleCreateCollection}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {collections.length === 0 ? (
            <div className="text-center text-gray-500">
              {isOwnProfile
                ? "No collections available. Create one to get started!"
                : "This user hasn&apos;t created any public collections yet."}
            </div>
          ) : (
            collections.map((collection) => {
              const isLoading = loadingCollections.has(collection.id);
              const hasImage = collectionBgImages[collection.id] !== undefined;

              // Determine if we should show this collection yet
              const shouldShowCollection = hasImage || !isLoading;

              // Get the image URL if available
              const bgUrl =
                collectionBgImages[collection.id] ||
                collection.assets?.[0]?.imageUrl ||
                "/placeholder/p03.png";

              return (
                <div key={collection.id} className="relative">
                  {/* Loading skeleton - shown while loading and no image available */}
                  {isLoading && !hasImage && (
                    <div className="w-full h-40 bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {/* Collection button - only shown once loaded or if we have a cached image */}
                  {shouldShowCollection && (
                    <button
                      onClick={() => onCollectionClick(collection)}
                      className="relative w-full h-40 bg-cover bg-center rounded-lg text-white text-xl font-bold flex items-center justify-center hover:opacity-90 shadow-lg"
                      style={{
                        backgroundImage: `url(${bgUrl})`,
                      }}
                    >
                      {/* Overlay for readability */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                      <span className="relative z-10">{collection.name}</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
