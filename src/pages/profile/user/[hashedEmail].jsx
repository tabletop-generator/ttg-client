// pages/profile/user/[hashedEmail].js - Page for viewing other users' profiles
import { getCollection, getUser, getUserAssets } from "@/api";
import AssetGrid from "@/components/Profile/AssetGrid";
import CollectionDetails from "@/components/Profile/CollectionDetails";
import CollectionGrid from "@/components/Profile/CollectionGrid";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import TabNavigation from "@/components/Profile/TabNavigation";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

function UserProfile() {
  const auth = useAuth();
  const router = useRouter();
  const { hashedEmail } = router.query;
  const { tab = "assets", collectionId } = router.query;
  const [activeTab, setActiveTab] = useState(tab);
  const [profileUser, setProfileUser] = useState(null);
  const [userAssets, setUserAssets] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useUser();

  // Check if the current user is viewing their own profile
  const isOwnProfile = currentUser?.hashedEmail === hashedEmail;

  // Redirect to personal profile if viewing own profile
  useEffect(() => {
    if (isOwnProfile) {
      router.push("/profile");
    }
  }, [isOwnProfile, router]);

  // Fetch user data for the profile being viewed
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!hashedEmail || !auth.user) return;

      setLoading(true);
      try {
        // Fetch user profile data
        const response = await getUser(auth.user, hashedEmail);

        if (response?.data?.user) {
          setProfileUser(response.data.user);
        } else {
          setError("User not found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [hashedEmail, auth.user]);

  // Fetch assets
  useEffect(() => {
    const fetchAssets = async () => {
      if (!auth.user || !hashedEmail) return;

      try {
        const assetsResponse = await getUserAssets(auth.user, hashedEmail);
        if (assetsResponse?.assets) {
          // Filter to only public assets when viewing another user's profile
          const publicAssets = assetsResponse.assets.filter(
            (asset) => asset.visibility === "public",
          );
          setUserAssets(publicAssets);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, [auth.user, hashedEmail]);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      if (!auth.user || !hashedEmail) return;

      try {
        const collectionResponse = await getCollection(auth.user, hashedEmail);
        if (collectionResponse && collectionResponse.collections) {
          // Filter to only public collections when viewing another user's profile
          const publicCollections = collectionResponse.collections.filter(
            (collection) => collection.visibility === "public",
          );
          setCollections(publicCollections);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, [auth.user, hashedEmail]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedCollection(null);
    router.push(`/profile/user/${hashedEmail}?tab=${tab}`, undefined, {
      shallow: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">
            {error || "User not found"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-6">
        {/* Profile Header - passing isOwnProfile=false */}
        <ProfileHeader
          username={profileUser.displayName}
          profilePhoto={profileUser.profilePictureUrl || "/placeholder/p01.png"}
          bio={profileUser.profileBio}
          isOwnProfile={false}
        />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Render Active Tab Content */}
        {activeTab === "assets" && (
          <AssetGrid assets={userAssets} isOwnProfile={false} />
        )}

        {activeTab === "collections" && !selectedCollection && (
          <CollectionGrid
            collections={collections}
            onCollectionClick={setSelectedCollection}
            isOwnProfile={false}
          />
        )}

        {selectedCollection && (
          <CollectionDetails
            collection={selectedCollection}
            onBack={() => setSelectedCollection(null)}
            isOwnProfile={false}
            allAssets={[]}
          />
        )}
      </div>
    </div>
  );
}

// Mark page as requiring authentication
UserProfile.protected = true;

export default UserProfile;
