export default function CollectionGrid({
  collections,
  onCollectionClick,
  onCreateCollection,
}) {
  return (
    <div>
      {/* Create Collection Button */}
      <div className="mb-4">
        <button
          onClick={onCreateCollection}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 shadow-md"
        >
          Create Collection
        </button>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => onCollectionClick(collection)}
            className="relative bg-cover bg-center rounded-lg text-white text-xl font-bold p-4 h-32 flex items-center justify-center hover:opacity-90 shadow-lg"
            style={{
              backgroundImage: `url(${collection.assets[0]?.image || "/placeholder/default.png"})`,
            }}
          >
            {collection.name}
          </button>
        ))}
      </div>
    </div>
  );
}
