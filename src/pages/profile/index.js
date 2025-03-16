import { getUser, getUserAssets } from "@/api";
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

function Profile() {
  const auth = useAuth();
  const router = useRouter();
  const { tab = "assets" } = router.query;

  const [activeTab, setActiveTab] = useState(tab);
  const [fetchedUser, setFetchedUser] = useState(null);
  const [userAssets, setUserAssets] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { user, setUser, hashedEmail } = useUser();

  // Fetch user data once on page load
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
          setUser(response.data.user);
          setFetchedUser(response.data.user);

          if (response.data.user.collections) {
            localStorage.setItem(
              "userCollections",
              JSON.stringify(response.data.user.collections),
            );
          }
        }
      } catch (error) {
        console.error("ERROR fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [auth.user, hashedEmail, setUser]);

  // Fetch assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const assetsResponse = await getUserAssets(auth.user);
        if (assetsResponse?.assets) {
          setUserAssets(assetsResponse.assets);
        } else {
          console.warn("Unexpected assets response structure:", assetsResponse);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    if (auth.user) {
      fetchAssets();
    }
  }, [auth.user]);

  // Memoized collections from fetchedUser
  const userCollections = useMemo(
    () => fetchedUser?.collections || [],
    [fetchedUser],
  );

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCollection(null);
    router.push(`/profile?tab=${tab}`, undefined, { shallow: true });
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
            onEdit={() => setIsEditing(true)}
          />
        ) : (
          <EditableProfileHeader
            username={user?.displayName}
            profilePhoto={user?.profilePictureUrl}
            bio={user?.profileBio}
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Render Active Tab Content */}
        {activeTab === "assets" && (
          <AssetGrid
            assets={userAssets}
            setUser={setUser}
            user={user}
            collections={userCollections}
            hashedEmail={hashedEmail}
          />
        )}

        {activeTab === "collections" && !selectedCollection && (
          <CollectionGrid
            user={user}
            setUser={setUser}
            collections={userCollections}
            onCollectionClick={setSelectedCollection}
          />
        )}

        {selectedCollection && (
          <CollectionDetails
            collection={selectedCollection}
            userCollections={userCollections}
            onBack={() => setSelectedCollection(null)}
            allAssets={userAssets}
            setUser={setUser}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
