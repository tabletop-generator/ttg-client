export default function AssetGrid({ assets, onAssetClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="bg-gray-700 rounded-lg p-4 text-center"
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
  );
}
