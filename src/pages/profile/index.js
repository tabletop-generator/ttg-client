// pages/profile/index.js
import AssetGrid from "@/components/Profile/AssetGrid";
import CollectionDetails from "@/components/Profile/CollectionDetails";
import CollectionGrid from "@/components/Profile/CollectionGrid";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import TabNavigation from "@/components/Profile/TabNavigation";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL; // Retrieve the log level for controlling console logs securely
const isDebug = logLevel === "debug"; // Boolean flag to enable debug-level console logging

function Profile() {
  const auth = useAuth(); // Access Cognito auth context
  const router = useRouter();
  const { tab = "assets" } = router.query;

  const [activeTab, setActiveTab] = useState(tab);
  const [assets, setAssets] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const { user } = useUser(); // Get user data from context

  // Get User Assets array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userAssets = user?.assets || [];

  if (isDebug) {
    console.log("User Assets:", userAssets);
  }

  // Get User Collection array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userCollections = user?.collections || [];

  if (isDebug) {
    console.log("User Collections:", userCollections);
  }

  // Set data for assets and collections
  useEffect(() => {
    setAssets(userAssets);
    setCollections(userCollections);
  }, [userAssets, userCollections]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCollection(null);
    router.push(`/profile?tab=${tab}`, undefined, { shallow: true });
  };

  const handleAssetClick = (assetId) => {
    router.push(`/profile/${assetId}`);
  };

  const handleCollectionClick = (collection) => {
    setSelectedCollection(collection);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        {/* Profile Header */}
        <ProfileHeader
          username={user?.displayName}
          profilePhoto={user?.profilePictureUrl}
          bio={user?.profileBio}
        />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Render Active Tab Content */}
        {activeTab === "assets" && (
          <AssetGrid
            assets={assets}
            onAssetClick={handleAssetClick}
            user={user}
          />
        )}

        {activeTab === "collections" && !selectedCollection && (
          <CollectionGrid
            collections={collections}
            onCollectionClick={handleCollectionClick}
          />
        )}
        {selectedCollection && (
          <CollectionDetails
            collection={selectedCollection}
            onBack={() => setSelectedCollection(null)}
            onAssetClick={handleAssetClick}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
