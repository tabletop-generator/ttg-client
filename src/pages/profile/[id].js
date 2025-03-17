import { getAssetByID } from "@/api";
import AssetDetailsCard from "@/components/Profile/AssetDetailsCard";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
function AssetDetails() {
  const router = useRouter();
  const { id } = router.query;
  const auth = useAuth();
  const { user, hashedEmail } = useUser();

  const [asset, setAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCollections, setUserCollections] = useState(
    user?.collections ?? [],
  );

  // const userCollections = user?.collections || [];

  useEffect(() => {
    if (!id || !auth.user?.id_token) {
      console.log("Asset ID or user token missing, skipping fetch.");
      return;
    }

    async function fetchAsset() {
      try {
        console.log("Fetching asset details for ID:", id);
        const response = await getAssetByID(auth.user, id);

        setAsset(response.data.asset);
      } catch (err) {
        console.error("Error fetching asset:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAsset();
  }, [id, auth.user?.id_token, auth.user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl text-red-500">Error: {error}</h1>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-xl">Asset not found</h1>
      </div>
    );
  }

  return (
    <AssetDetailsCard
      user={user}
      hashedEmail={hashedEmail}
      asset={asset}
      setUserCollections={setUserCollections}
      collections={userCollections}
      onBack={() => router.back()}
    />
  );
}

export default AssetDetails;
