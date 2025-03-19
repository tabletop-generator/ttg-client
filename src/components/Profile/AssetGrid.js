import { useRouter } from "next/router";

export default function AssetGrid({ assets }) {
  const router = useRouter();

  const handleAssetClick = (uuid) => {
    console.log("Clicked Asset UUID:", uuid);
    sessionStorage.setItem("previousPage", window.location.href); // Store current page
    router.push(`/profile/${uuid}`); //Navigate to Asset Details
  };

  return (
    <div>
      {assets.length === 0 ? (
        <div className="text-gray-500 text-center">
          No assets yet! Time to get creative and add some treasures to your
          library!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.uuid}
              className="bg-gray-700 rounded-lg p-4 text-center"
              onClick={() => handleAssetClick(asset.uuid)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full aspect-square object-cover rounded-md mb-4"
              />
              <h5 className="text-lg font-bold text-white">{asset.name}</h5>
              <p className="text-gray-400 capitalize">{asset.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
