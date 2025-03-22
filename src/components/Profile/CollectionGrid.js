// src/components/Profile/CollectionGrid.js
import {
  getAssetByID,
  getCollectionById,
  getUser,
  postCollection,
} from "@/api";
import CreateCollectionForm from "@/components/Profile/CreateCollectionForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function CollectionGrid({
  user,
  setUser,
  collections,
  onCollectionClick,
  isOwnProfile = true, // Added ownership flag with default true for backward compatibility
}) {
  const auth = useAuth();
  const router = useRouter();
  const cognitoUser = auth.user;
  const [isCreating, setIsCreating] = useState(false);

  // State to hold the first asset's image URL for each collection
  const [collectionBgImages, setCollectionBgImages] = useState({});
  // Add loading state and error state
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // For each collection, fetch ONLY essential image data with rate limiting
  useEffect(() => {
    async function fetchBgImages() {
      if (!collections?.length || !cognitoUser?.id_token || isLoadingImages) {
        return;
      }

      setIsLoadingImages(true);
      setLoadError(null);

      const newBgImages = {};

      // Only process first 5 collections to reduce API load
      const collectionsToProcess = collections.slice(0, 5);

      try {
        // Process collections one by one with delay to avoid rate limits
        for (const collection of collectionsToProcess) {
          if (!collection.id) continue;

          try {
            // If we already have image data in the collection, use it directly
            if (collection.assets?.[0]?.imageUrl) {
              newBgImages[collection.id] = collection.assets[0].imageUrl;
              continue; // Skip API call if we already have an image
            }

            // Otherwise make API call to get collection details
            const colResponse = await getCollectionById(
              cognitoUser,
              collection.id,
            );
            if (colResponse?.collection?.assets?.length > 0) {
              // Get first asset
              const assetEntry = colResponse.collection.assets[0];
              const uuid =
                typeof assetEntry === "string" ? assetEntry : assetEntry.uuid;

              // Only fetch the asset details if we have a UUID and don't already have the image
              if (uuid) {
                try {
                  const assetResponse = await getAssetByID(cognitoUser, uuid);
                  if (assetResponse?.data?.asset?.imageUrl) {
                    newBgImages[collection.id] =
                      assetResponse.data.asset.imageUrl;
                  }
                } catch (assetError) {
                  console.error(
                    `Error fetching asset for collection ${collection.id}:`,
                    assetError,
                  );
                  // Continue with next collection instead of failing completely
                }
              }
            }

            // Add a small delay between requests to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 200));
          } catch (colError) {
            // Log error but continue with other collections
            console.error(
              `Error fetching collection details for ${collection.id}:`,
              colError,
            );
            // If we hit a rate limit, stop processing completely
            if (colError.status === 429) {
              setLoadError("Rate limit exceeded. Please try again later.");
              break;
            }
          }
        }

        // Update state with any images we successfully fetched
        setCollectionBgImages((prev) => ({ ...prev, ...newBgImages }));
      } catch (error) {
        console.error("Error fetching background images:", error);
        setLoadError("Failed to load collection images");
      } finally {
        setIsLoadingImages(false);
      }
    }

    fetchBgImages();
  }, [collections, cognitoUser]);

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
        // Fetch updated user data to get the new collection
        const updatedUserResponse = await getUser(
          cognitoUser,
          user.hashedEmail,
        );
        if (updatedUserResponse?.data?.user) {
          setUser(updatedUserResponse.data.user);
          console.log(
            "Updated user collections:",
            updatedUserResponse.data.user.collections,
          );

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
              // Use the fetched background image if available,
              // otherwise fallback to the minimal collection data or a placeholder
              const bgUrl =
                collectionBgImages[collection.id] ||
                collection.assets?.[0]?.imageUrl ||
                "/placeholder/p03.png";

              return (
                <button
                  key={collection.id}
                  onClick={() => onCollectionClick(collection)}
                  className="relative w-full h-40 bg-cover bg-center rounded-lg text-white text-xl font-bold flex items-center justify-center hover:opacity-90 shadow-lg"
                  style={{
                    backgroundImage: `url(${bgUrl})`,
                  }}
                >
                  {/* Show loading indicator if we're still loading images */}
                  {isLoadingImages && !collectionBgImages[collection.id] && (
                    <div className="absolute top-2 right-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}

                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                  <span className="relative z-10">{collection.name}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
