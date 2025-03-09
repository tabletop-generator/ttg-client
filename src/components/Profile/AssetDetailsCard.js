import { deletePrismaAsset, updatePrismaAssetInfo } from "@/api";
import { Edit, Heart, Trash } from "lucide-react";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

export default function AssetDetailsCard({ asset, onBack }) {
  const auth = useAuth();
  const user = auth.user;
  const [likes, setLikes] = useState(asset?.likes || 0); // Fake likes

  const [visibility, setVisibility] = useState(asset?.visibility || "private");

  const [name, setName] = useState(asset?.name || "Unnamed");
  const [description, setDescription] = useState(
    asset?.description || "No backstory available.",
  );
  const [isEditing, setIsEditing] = useState(false);

  const defaultImage = "/placeholder/p01.png"; // Fallback image

  const handleLike = () => setLikes(likes + 1);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        await deletePrismaAsset(asset.id);
        onBack(); // Navigate back after deletion
        setTimeout(() => {
          window.location.reload();
        }, 100);
        console.log("Asset deleted successfully!");
      } catch (error) {
        console.error("Failed to delete asset:", error);
      }
    }
  };

  const handleToggleVisibility = (newVisibility) => {
    setVisibility(newVisibility);
    console.log("Visibility set to:", newVisibility);
  };

  const handleSave = async () => {
    const newInfo = {
      name,
      description,
      visibility,
    };

    console.log("New info being sent to API:", newInfo);

    try {
      await updatePrismaAssetInfo(user, asset.uuid, newInfo);
      console.log("Asset updated successfully!");
      asset.visibility = visibility;
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating asset:", error);
    }
  };

  const handleCancel = () => {
    setName(asset?.name || "Unnamed");
    setDescription(asset?.description || "No backstory available.");
    setVisibility(asset?.visibility || "private");
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-4/5 max-w-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.imageUrl || defaultImage}
          alt={asset.name || "Unknown Asset"}
          className="w-full rounded-lg mb-6"
        />

        <div className="flex items-center justify-between mb-6">
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

        <p className="text-gray-400 mb-2 capitalize">
          <strong>Type:</strong> {asset.type || "Unknown Type"}
        </p>
        <p className="text-gray-400 mb-6">
          <strong>Created:</strong>{" "}
          {asset.createdAt
            ? new Date(asset.createdAt).toISOString().split("T")[0]
            : "N/A"}
        </p>

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

        {isEditing && (
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => handleToggleVisibility("public")}
              className={`px-4 py-2 rounded-md ${
                visibility === "public"
                  ? "bg-gray-400 text-black"
                  : "bg-gray-600 text-white"
              }`}
            >
              Public
            </button>
            <button
              onClick={() => handleToggleVisibility("private")}
              className={`px-4 py-2 rounded-md ${
                visibility === "private"
                  ? "bg-gray-400 text-black"
                  : "bg-gray-600 text-white"
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
              {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
            </span>
          </p>
        )}

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
