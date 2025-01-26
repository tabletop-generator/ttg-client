export default function CollectionDetails({
  collection,
  onBack,
  onAssetClick,
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 mb-4"
      >
        Back to Collections
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collection.assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-gray-800 rounded-lg p-4 text-center"
            onClick={() => onAssetClick(asset.id)}
          >
            <img
              src={asset.image}
              alt={asset.name}
              className="w-full aspect-square object-cover rounded-md mb-4"
            />
            <h5 className="text-lg font-bold text-white">{asset.name}</h5>
            <p className="text-gray-400 capitalize">{asset.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
