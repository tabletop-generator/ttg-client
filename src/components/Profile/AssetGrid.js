// Updated AssetGrid.js with optimized images
import OptimizedImage from "@/components/OptimizedImage";
import { useRouter } from "next/router";

export default function AssetGrid({ assets, isOwnProfile = true }) {
  const router = useRouter();

  const handleAssetClick = (uuid) => {
    console.log("Clicked Asset UUID:", uuid);
    sessionStorage.setItem("previousPage", window.location.href); // Store current page
    router.push(`/profile/${uuid}`); // Navigate to Asset Details
  };

  return (
    <div>
      {assets.length === 0 ? (
        <div className="text-gray-500 text-center">
          {isOwnProfile
            ? "No assets yet! Time to get creative and add some treasures to your library!"
            : "This user hasn't created any public assets yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.uuid}
              className="bg-gray-700 rounded-lg p-4 text-center cursor-pointer transition transform hover:scale-105"
              onClick={() => handleAssetClick(asset.uuid)}
            >
              {/* Optimized Image Component */}
              <OptimizedImage
                src={asset.imageUrl}
                alt={asset.name}
                width={400}
                height={400}
                className="w-full aspect-square object-cover rounded-md mb-4"
                imageId={asset.uuid || asset.id}
                objectFit="cover"
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
