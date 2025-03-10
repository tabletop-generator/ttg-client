import CreateCollectionForm from "@/components/Profile/CreateCollectionForm";
import { useState } from "react";

export default function CollectionGrid({ collections, onCollectionClick }) {
  // Fake default collection
  const defaultFakeCollection = [
    {
      id: "fake-1234",
      name: "The Chamber of Secrets",
      visibility: "public",
      assets: [
        {
          assetId: "1234",
          name: "The Magnificent Dwarf",
          imageUrl: "/placeholder/p03.png",
        },
      ], // Placeholder image
    },
  ];

  // Ensure at least one collection exists
  const [isCreating, setIsCreating] = useState(false);
  const [fakeCollections, setFakeCollections] = useState(
    collections.length > 0 ? collections : defaultFakeCollection,
  );

  const handleCreateCollection = (newCollection) => {
    setFakeCollections([...fakeCollections, newCollection]); // Add new collection
    setIsCreating(false); // Hide form after creation
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

      {/* Show Create Collection Form */}
      {isCreating ? (
        <CreateCollectionForm
          onCancel={() => setIsCreating(false)}
          onCreate={handleCreateCollection}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {fakeCollections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onCollectionClick(collection)}
              className="relative w-full h-40 bg-cover bg-center rounded-lg text-white text-xl font-bold flex items-center justify-center hover:opacity-90 shadow-lg"
              style={{
                backgroundImage: `url(${collection.assets[0]?.imageUrl || "/placeholder/p03.png"})`,
              }}
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
              <span className="relative z-10">{collection.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
