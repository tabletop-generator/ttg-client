/* eslint-disable react-hooks/exhaustive-deps */
import {
  getCollection,
  getCollectionById,
  getUser,
  getUserAssets,
} from "@/api";
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
  const { tab = "assets", collectionId } = router.query;

  const [activeTab, setActiveTab] = useState(tab);
  const [fetchedUser, setFetchedUser] = useState(null);
  const [userAssets, setUserAssets] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sharedCollection, setSharedCollection] = useState(null);
  const [loadingShared, setLoadingShared] = useState(false);

  const { user, setUser, hashedEmail } = useUser();

  // Fetch user data once on page load
  useEffect(() => {
    const fetchUserData = async () => {
      console.log("fetching user");
      try {
        const _user = auth.user;
        if (!_user) {
          console.error("No authenticated user found.");
          return;
        }
        const response = await getUser(_user, hashedEmail);
        if (response) {
          // Destructure the returned user
          const fetchedUserData = response.data.user;

          // Ensure default values if fields are missing
          const userData = {
            ...fetchedUserData,
            displayName:
              fetchedUserData.displayName ||
              _user?.profile?.["cognito:username"],
            profileBio:
              fetchedUserData.profileBio ||
              "Undefined. Still loading... Stay tuned.",
            profilePictureUrl: localStorage.getItem("profilePictureUrl"),
          };

          setUser(userData);
          setFetchedUser(userData);
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
        const assetsResponse = await getUserAssets(auth.user, hashedEmail);
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

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionResponse = await getCollection(
          auth.user,
          user.hashedEmail,
        );
        if (collectionResponse && collectionResponse.collections) {
          setCollections(collectionResponse.collections);
        } else {
          console.warn("Unexpected collection response:", collectionResponse);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    if (auth.user && user?.hashedEmail) {
      fetchCollections();
    }
  }, [auth.user, user?.hashedEmail]);

  // Memoized collections from fetchedUser (fallback if needed)
  const userCollections = useMemo(
    () => fetchedUser?.collections || collections,
    [fetchedUser, collections],
  );

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCollection(null);
    router.push(`/profile?tab=${tab}`, undefined, { shallow: true });
  };
  useEffect(() => {
    if (tab === "collections" && collectionId && auth.user?.id_token) {
      setLoadingShared(true);
      (async () => {
        try {
          const res = await getCollectionById(auth.user, collectionId);
          // Adjust this according to your API response; here we expect res.collection
          if (res && res.collection) {
            console.log("Fetched shared collection:", res.collection);
            setSharedCollection(res.collection);
          } else {
            console.warn("Shared collection not found or not public");
          }
        } catch (error) {
          console.error("Error fetching shared collection:", error);
        } finally {
          setLoadingShared(false);
        }
      })();
    }
  }, [tab, collectionId, auth.user]);

  // If we are in the collections tab with a collectionId, render the shared collection details.
  if (tab === "collections" && collectionId) {
    if (loadingShared) return <div>Loading shared collection...</div>;
    if (!sharedCollection) return <div>Shared collection not found.</div>;
    return (
      <CollectionDetails
        collection={sharedCollection}
        hashedEmail={hashedEmail}
        onBack={() => router.push("/profile?tab=collections")}
        userCollections={[]}
        allAssets={[]}
        test="test"
      />
    );
  }
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
            hashedEmail={hashedEmail}
            userToken={auth.user.id_token}
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
            user={user}
            setUser={setUser}
            collection={selectedCollection}
            userCollections={userCollections}
            onBack={() => setSelectedCollection(null)}
            allAssets={userAssets}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
