import { getUser, updatePrismaUserInfo } from "@/api";
import AssetGrid from "@/components/Profile/AssetGrid";
import CollectionDetails from "@/components/Profile/CollectionDetails";
import CollectionGrid from "@/components/Profile/CollectionGrid";
import EditableProfileHeader from "@/components/Profile/EditableProfileHeader";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import TabNavigation from "@/components/Profile/TabNavigation";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";

const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL;
const isDebug = logLevel === "debug";

function Profile() {
  const auth = useAuth();
  const router = useRouter();
  const { tab = "assets" } = router.query;

  const [activeTab, setActiveTab] = useState(tab);
  const [fetchedUser, setFetchedUser] = useState(null); // Store fetched user data
  const [selectedCollection, setSelectedCollection] = useState(null);

  const { user, setUser, hashedEmail } = useUser();

  // Fetch user data once on page load to make sure we have latest info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const _user = auth.user;

        if (!_user) {
          console.error("No authenticated user found.");
          return;
        }

        const response = await getUser(_user, hashedEmail);

        if (response) {
          if (isDebug) console.log("Fetched user:", response);

          const userData = {
            ...response.data.user,
            displayName:
              response.data.user.displayName ||
              _user?.profile?.["cognito:username"],
            profileBio:
              response.data.user.profileBio ||
              "Undefined. Still loading... Stay tuned.",
            profilePictureUrl:
              response.data.user.profilePictureUrl || "/placeholder/p03.png",
          };

          // Update context and local storage
          setUser(userData);
          localStorage.setItem("userInfo", JSON.stringify(userData));
          window.dispatchEvent(new Event("storage"));

          // Set fetched user data
          setFetchedUser(response.data.user);
        }
      } catch (error) {
        console.error("ERROR fetching user data: ", error);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on page load

  // Memoized assets and collections
  const userAssets = useMemo(() => fetchedUser?.assets || [], [fetchedUser]);
  const userCollections = useMemo(
    () => fetchedUser?.collections || [],
    [fetchedUser],
  );

  if (isDebug) {
    console.log("User Assets:", userAssets);
    console.log("User Collections:", userCollections);
  }
  // State for toggling edit mode
  const [isEditing, setIsEditing] = useState(false);

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

  const handleSave = async (user, newUsername, newBio, newProfilePhoto) => {
    const updatedUser = {
      ...user,
      displayName: newUsername,
      profileBio: newBio,
      profilePictureUrl: newProfilePhoto,
    };

    setUser(updatedUser);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("storage"));

    try {
      await updatePrismaUserInfo({
        id: user.id,
        id_token: auth.user.id_token,
        displayName: newUsername,
        profileBio: newBio,
        profilePictureUrl: newProfilePhoto,
      });
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
    }

    setIsEditing(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        {/* Profile Header */}
        {!isEditing ? (
          <ProfileHeader
            username={user?.displayName}
            profilePhoto={user?.profilePictureUrl}
            bio={user?.profileBio}
            onEdit={() => setIsEditing(true)} // Enable edit mode
          />
        ) : (
          <EditableProfileHeader
            username={user?.displayName}
            profilePhoto={user?.profilePictureUrl}
            bio={user?.profileBio}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        )}

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Render Active Tab Content */}
        {activeTab === "assets" && (
          <AssetGrid
            assets={userAssets}
            onAssetClick={handleAssetClick}
            user={user}
          />
        )}

        {activeTab === "collections" && !selectedCollection && (
          <CollectionGrid
            collections={userCollections}
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
