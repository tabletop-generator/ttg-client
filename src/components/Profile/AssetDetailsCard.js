import { deletePrismaAssetInfo, updatePrismaAssetInfo } from "@/api";
import { Edit, Heart, Trash } from "lucide-react";
import { useState } from "react";
export default function AssetDetailsCard({ asset, onBack }) {
  const [likes, setLikes] = useState(asset?.likes || 0); // Fake likes
  const [isPublic, setIsPublic] = useState(asset?.isFeatured); // Public/Private
  const [name, setName] = useState(asset?.name || "Unnamed"); // Name
  const [description, setDescription] = useState(
    asset?.description || "No backstory available.",
  ); // Description
  const [isEditing, setIsEditing] = useState(false); // Edit Mode

  const defaultImage = "/placeholder/p01.png"; // Fallback image

  const handleLike = () => setLikes(likes + 1); // Increment likes

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        await deletePrismaAssetInfo(asset.id);

        onBack(); // Navigate back after deletion

        // Force refresh the previous page after a slight delay
        setTimeout(() => {
          window.location.reload();
        }, 100); // Delay to ensure navigation completes before reload

        console.log("Asset deleted successfully!");
      } catch (error) {
        console.error("Failed to delete asset:", error);
      }
    }
  };

  const handleSave = async () => {
    try {
      await updatePrismaAssetInfo({
        id: asset.id,
        name,
        description,
        isPublic,
      });
      console.log("Asset updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update asset:", error);
    }
  };

  const handleCancel = () => {
    // Revert to original values
    setName(asset?.name || "Unnamed");
    setDescription(asset?.description || "No backstory available.");
    setIsPublic(asset?.isPublic || true);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-4/5 max-w-2xl">
        {/* Asset Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.imageUrl || defaultImage}
          alt={asset.name || "Unknown Asset"}
          className="w-full rounded-lg mb-6"
        />

        {/* Name, Likes, Edit Button */}
        <div className="flex items-center justify-between mb-6">
          {/* Name */}
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-3xl font-bold text-black p-2 rounded w-2/3"
              placeholder="Enter Asset Name"
            />
          ) : (
            <h1 className="text-3xl font-bold text-white">{name}</h1>
          )}

          {/* Like & Edit Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center text-red-500 hover:opacity-80"
            >
              <Heart className="w-5 h-5 mr-1" />
              <span>{likes}</span>
            </button>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-yellow-400 hover:text-yellow-300"
              >
                <Edit className="w-5 h-5 mr-1" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Asset Info */}
        <p className="text-gray-400 mb-2 capitalize">
          <strong>Type:</strong> {asset.type || "Unknown Type"}
        </p>
        <p className="text-gray-400 mb-6">
          <strong>Created:</strong>{" "}
          {asset.createdAt
            ? new Date(asset.createdAt).toISOString().split("T")[0]
            : "N/A"}
        </p>

        {/* Backstory / Description */}
        <h2 className="text-2xl font-bold text-white mb-4">Backstory</h2>

        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 text-black rounded mb-4"
            rows="4"
            placeholder="Enter Backstory"
          />
        ) : (
          <p className="text-gray-300 leading-relaxed mb-6">{description}</p>
        )}

        {/* Visibility Toggle in Edit Mode */}
        {isEditing && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setIsPublic(true)}
              className={`px-4 py-2 rounded-md ${
                isPublic ? "bg-gray-400 text-black" : "bg-gray-600 text-white"
              }`}
            >
              Public
            </button>
            <button
              onClick={() => setIsPublic(false)}
              className={`px-4 py-2 rounded-md ${
                !isPublic ? "bg-gray-400 text-black" : "bg-gray-600 text-white"
              }`}
            >
              Private
            </button>
          </div>
        )}

        {!isEditing && (
          <p className="text-gray-400 mt-4">
            Current visibility:{" "}
            <span className="text-white">
              {isPublic ? "Public" : "Private"}
            </span>
          </p>
        )}

        {/* Save, Cancel & Delete Buttons in Edit Mode */}
        {isEditing && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400"
            >
              <Trash className="w-5 h-5 mr-1" />
              Delete
            </button>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Back
        </button>
      </div>
    </div>
  );
}
