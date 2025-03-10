import { MoreHorizontal, Plus, Share2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function CollectionDetails({
  collection,
  onBack,
  onAssetClick,
  allAssets,
}) {
  const router = useRouter();
  const [showAssetGrid, setShowAssetGrid] = useState(false);
  const [updatedAssets, setUpdatedAssets] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  // Get the first asset image OR use a placeholder
  const backgroundImageUrl =
    collection.assets?.[0]?.imageUrl || "/placeholder/p02.png";

  // Initialize assets when the collection loads
  useEffect(() => {
    setUpdatedAssets(collection.assets || []);
  }, [collection.assets]);

  // Handle adding an asset (ensure proper ID)
  const handleAddAsset = (asset) => {
    if (!asset.id && !asset.uuid) {
      console.error("Asset is missing an ID or UUID:", asset);
      return;
    }

    setUpdatedAssets((prevAssets) => {
      if (!prevAssets.some((a) => a.id === asset.id || a.uuid === asset.uuid)) {
        return [...prevAssets, asset];
      }
      return prevAssets;
    });

    setShowAssetGrid(false); // Close asset grid after selection
  };

  // Navigate to asset details page
  const handleAssetClick = (asset) => {
    const assetId = asset.uuid || asset.id;
    if (!assetId) {
      console.log("I am just a friendly placeholder");
      return;
    }
    console.log("Navigating to asset:", assetId);
    router.push(`/profile/${assetId}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Share (Copy Link)
  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div>
      {/* Collection Banner - Uses First Asset as Background */}
      <div
        className="relative w-full h-40 bg-cover bg-center rounded-lg flex items-center justify-center text-white text-2xl font-bold"
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
        <span className="relative z-10">{collection.name}</span>
      </div>

      {/* Top Section */}
      <div className="mt-4 mb-6 flex items-center justify-between">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Back to Collections
        </button>

        {/* Right Buttons */}
        <div className="flex gap-3">
          {/* Add Asset Button (Round with Plus Icon) */}
          <button
            onClick={() => setShowAssetGrid(true)}
            className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-600"
          >
            <Plus size={20} />
          </button>

          {/* Share Collection Button*/}
          <div className="relative">
            <button
              onClick={handleShare}
              className={`w-10 h-10 text-white rounded-full flex items-center justify-center transition-colors duration-300 ${
                copied
                  ? "bg-green-500 hover:bg-green-400"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <Share2 size={20} />
            </button>
            {copied && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transform px-3 py-1 bg-white text-black text-sm rounded shadow-lg z-10 whitespace-nowrap">
                Copied to Clipboard!
                <div
                  className="absolute bottom-0 left-1/2 transform translate-y-full -translate-x-1/2 w-0 h-0
          border-l-[6px] border-l-transparent
          border-r-[6px] border-r-transparent
          border-t-[6px] border-t-white"
                ></div>
              </div>
            )}
          </div>

          {/* More Options Button*/}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-600"
            >
              <MoreHorizontal size={20} />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-gray-800 text-white rounded-md shadow-lg w-32">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                  onClick={() => console.log("Edit Collection")}
                >
                  Edit
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700"
                  onClick={() => console.log("Delete Collection")}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Show Asset Selection Grid */}
      {showAssetGrid && (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">
              Select an Asset to Add
            </h3>
            <button
              onClick={() => setShowAssetGrid(false)}
              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {allAssets.map((asset) => (
              <div
                key={asset.id || asset.uuid}
                className="bg-gray-800 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-700"
                onClick={() => handleAddAsset(asset)}
              >
                {" "}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  className="w-full aspect-square object-cover rounded-md mb-2"
                />
                <h5 className="text-lg font-bold text-white">{asset.name}</h5>
                <p className="text-gray-400 capitalize">{asset.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collection Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {updatedAssets.map((asset, index) => (
          <div
            key={asset.id || asset.uuid || `fallback-key-${index}`}
            className="bg-gray-800 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-700"
            onClick={() => handleAssetClick(asset)}
          >
            {" "}
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
    </div>
  );
}
