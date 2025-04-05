// src/pages/profile/[id].js - Complete revised version
import { getAssetByID } from "@/api";
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

        // Wait for auth to be ready before making the API call
        if (auth.isLoading) {
          return;
        }

        // Pass auth user if authenticated
        console.log("Auth state:", auth.isAuthenticated, auth.isLoading);
        const response = await getAssetByID(auth.user, id);

        console.log("Asset fetch response:", response);

        if (!response || !response.data || !response.data.asset) {
          console.error("Invalid response structure:", response);
          setError("Invalid response from server");
          setIsLoading(false);
          return;
        }

        setAsset(response.data.asset);

        // Verify this is a public asset if user isn't authenticated
        if (
          !auth.isAuthenticated &&
          response.data.asset.visibility !== "public"
        ) {
          setError(
            "This asset is private and can only be viewed by the owner or authenticated users.",
          );
        }
      } catch (err) {
        console.error("Error fetching asset:", err);
        setError(err.message || "Failed to load asset details");
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

export default AssetDetails;
