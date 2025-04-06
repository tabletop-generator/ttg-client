// src/pages/discover/[id].js
import AssetDetailsCard from "@/components/Profile/AssetDetailsCard";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

function AssetDetails() {
  const router = useRouter();
  const auth = useAuth();
  const { user, hashedEmail } = useUser();

  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCollections, setUserCollections] = useState(
    user?.collections ?? [],
  );
  // Add a new state for guest preview mode
  const [guestPreviewMode, setGuestPreviewMode] = useState(false);

  useEffect(() => {
    // Wait for router to be ready and ID to be available
    if (!router.isReady) {
      return;
    }

    const { id } = router.query;

    if (!id) {
      console.log("Asset ID missing, skipping fetch.");
      return;
    }

    async function fetchAsset() {
      try {
        console.log("Fetching asset details for ID:", id);

        // Check if asset ID looks like a placeholder
        if (id.startsWith("placeholder-")) {
          setError("This is a placeholder asset and cannot be viewed.");
          setIsLoading(false);
          return;
        }

        //debug
        console.log(
          "Auth status:",
          auth.isAuthenticated ? "Authenticated" : "Guest",
        );
        // Try to fetch the real asset regardless of authentication status
        try {
          // Create headers with or without authorization
          const headers = {
            "Content-Type": "application/json",
          };

          // Add authorization header if authenticated
          if (auth.isAuthenticated && auth.user?.id_token) {
            headers.Authorization = `Bearer ${auth.user.id_token}`;
          }

          // Direct API call to fetch the asset for unauthenticated users
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/v1/assets/${id}`,
            {
              method: "GET",
              headers,
            },
          );

          // debug
          console.log("API Response status:", response.status);

          if (!response.ok) {
            throw new Error(`Failed to fetch asset: ${response.status}`);
          }

          const data = await response.json();

          // Set guest preview mode, but use the real asset data
          if (!auth.isAuthenticated) {
            setGuestPreviewMode(true);
          }

          const processedAsset = {
            ...data.asset,
            creatorName:
              data.asset.creatorName ||
              data.asset.user?.displayName ||
              "Unknown Creator",
          };

          // Add debug info
          console.log("Creator info:", {
            original: data.asset.creatorName,
            processed: processedAsset.creatorName,
            userInfo: data.asset.user,
          });

          setAsset(processedAsset);

          // debug logging for user profile:
          console.log("Asset data received:", {
            hasCreator: !!data.asset.user,
            hasHashedEmail: !!data.asset.user?.hashedEmail,
            creatorName: data.asset.creatorName || "Not set",
            rawUserData: data.asset.user,
          });

          // For private assets viewed by unauthenticated users
          if (!auth.isAuthenticated && data.asset.visibility !== "public") {
            setError(
              "This asset is private and can only be viewed by the owner or authenticated users.",
            );
          }
        } catch (fetchError) {
          console.error("Error fetching asset:", fetchError);
          // Add this to see the exact error message
          console.error("Detailed error:", fetchError.toString());

          // If fetch fails for unauthenticated users, show placeholder
          if (!auth.isAuthenticated) {
            setGuestPreviewMode(true);

            // Create a simplified preview asset as a fallback
            const previewAsset = {
              uuid: id,
              name: "Preview Asset",
              type: "Asset Preview",
              description:
                "Log in to view full details and interact with this asset.",
              imageUrl: "/placeholder/p01.png",
              likes: 0,
              visibility: "public",
              createdAt: new Date().toISOString(),
              creatorName: "Unknown Creator",
              // Add an empty likedBy array to prevent undefined errors
              likedBy: [],
              // Add empty user object
              user: {},
            };

            setAsset(previewAsset);
          } else {
            setError(fetchError.message || "Failed to load asset details");
          }
        }
      } catch (err) {
        console.error("Outer error fetching asset:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAsset();
  }, [
    router.isReady,
    router.query,
    auth.isAuthenticated,
    auth.isLoading,
    auth.user,
  ]);

  // If router not ready yet, show initial loading
  if (!router.isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl">Preparing to load asset...</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl">Loading asset details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl text-red-500 mb-4">Error: {error}</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl mb-4">Asset not found</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Determine if this asset belongs to the current user
  // Only authenticated users can own assets
  const isMyAsset =
    auth.isAuthenticated && asset.user?.hashedEmail === hashedEmail;

  return (
    <AssetDetailsCard
      user={user}
      hashedEmail={hashedEmail}
      asset={asset}
      setUserCollections={setUserCollections}
      collections={userCollections}
      isMyAsset={isMyAsset}
      isAuthenticated={auth.isAuthenticated}
      isGuestPreview={guestPreviewMode} // New prop
      onBack={() => {
        // Check if there's a stored previous page in sessionStorage
        const previousPage = sessionStorage.getItem("previousPage");
        if (previousPage) {
          router.push(previousPage);
          // Clear the stored path after use
          sessionStorage.removeItem("previousPage");
        } else {
          router.back();
        }
      }}
    />
  );
}

// Mark page as not protected
AssetDetails.protected = false;

export default AssetDetails;
