import { getUser, postCollection } from "@/api";

import CreateCollectionForm from "@/components/Profile/CreateCollectionForm";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
export default function CollectionGrid({
  user,
  setUser,
  collections,
  onCollectionClick,
}) {
  const auth = useAuth();
  const router = useRouter();
  const cognitoUser = auth.user;
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateCollection = async (newCollection) => {
    if (!user || !cognitoUser) {
      console.error(
        "Missing user info. Cannot create collection without both user sources.",
      );
      setIsCreating(false);
      return;
    }

    // Combine both user objects, ensuring the token is under 'id_token'
    const combinedUser = {
      ...user,
      id_token: cognitoUser.id_token,
    };

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
      {/* Create Collection Button */}
      {!isCreating && (
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
      {isCreating ? (
        <CreateCollectionForm
          onCancel={() => setIsCreating(false)}
          onCreate={handleCreateCollection}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {collections.length === 0 ? (
            <div className="text-center text-gray-500">
              No collections available. Create one to get started!
            </div>
          ) : (
            collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => onCollectionClick(collection)}
                className="relative w-full h-40 bg-cover bg-center rounded-lg text-white text-xl font-bold flex items-center justify-center hover:opacity-90 shadow-lg"
                style={{
                  backgroundImage: `url(${collection.assets?.[0]?.imageUrl || "/placeholder/p03.png"})`,
                }}
              >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                <span className="relative z-10">{collection.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
