// pages/profile/index.js

import AssetGrid from "@/components/Profile/AssetGrid";
import CollectionDetails from "@/components/Profile/CollectionDetails";
import CollectionGrid from "@/components/Profile/CollectionGrid";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import TabNavigation from "@/components/Profile/TabNavigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Profile() {
  const auth = useAuth(); // Access Cognito auth context
  const router = useRouter();
  const { tab = "assets" } = router.query;

  const [activeTab, setActiveTab] = useState(tab);
  const [assets, setAssets] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  // Extract user information from Cognito
  const user = {
    username: auth?.user?.profile?.["cognito:username"] || "Guest",
    profilePhoto: "/placeholder/p03.png", // Placeholder profile photo
    bio: "No bio available", // Fallback bio
  };

  // Placeholder data for assets and collections
  useEffect(() => {
    const placeholderAssets = [
      {
        id: "asset1",
        name: "Lyricelle Emberwhisper",
        type: "character",
        image: "/placeholder/card_character.png",
      },
      {
        id: "asset2",
        name: "Whispering Woods",
        type: "location",
        image: "/placeholder/card_environment.png",
      },
      {
        id: "asset3",
        name: "Map of Eldoria",
        type: "map",
        image: "/placeholder/card_map.png",
      },
      {
        id: "asset4",
        name: "Quest for the Eternal Flame",
        type: "quest",
        image: "/placeholder/card_quest.png",
      },
    ];

    const placeholderCollections = [
      {
        id: "collection1",
        name: "Characters",
        assets: [
          {
            id: "asset1",
            name: "Lyricelle Emberwhisper",
            type: "character",
            image: "/placeholder/card_character.png",
          },
        ],
      },
      {
        id: "collection2",
        name: "Locations",
        assets: [
          {
            id: "asset2",
            name: "Whispering Woods",
            type: "location",
            image: "/placeholder/card_environment.png",
          },
        ],
      },
    ];

    setAssets(placeholderAssets);
    setCollections(placeholderCollections);
  }, []);

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
          username={user.username}
          profilePhoto={user.profilePhoto}
          bio={user.bio}
        />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Render Active Tab Content */}
        {activeTab === "assets" && (
          <AssetGrid assets={assets} onAssetClick={handleAssetClick} />
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
