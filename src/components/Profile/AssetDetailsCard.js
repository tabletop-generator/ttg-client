import { Heart, Trash } from "lucide-react";
import { useState } from "react";

export default function AssetDetailsCard({ asset, onBack }) {
  const [likes, setLikes] = useState(asset?.likes || 0); // Fake likes
  const [isPublic, setIsPublic] = useState(true); // Fake public/private toggle
  const [newName, setNewName] = useState(asset?.name || "Unnamed"); // Fake name change
  const [isEditingName, setIsEditingName] = useState(false);

  const defaultImage = "/placeholder/default.png"; // Fallback image

  const handleLike = () => {
    setLikes(likes + 1); // Increment likes
  };

  const handleNameChange = () => {
    if (newName.trim()) {
      setIsEditingName(false); // Exit edit mode
    }
  };

  const handleDelete = () => {
    alert("This is a fake delete action."); // Fake delete
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-4/5 max-w-2xl">
        {/* Asset Image */}
        <img
          src={asset.image || defaultImage}
          alt={asset.name || "Unknown Asset"}
          className="w-full rounded-lg mb-6"
        />

        {/* Asset Name, Likes, and Delete in a Single Row */}
        <div className="flex items-center justify-between mb-6">
          {/* Name Editing */}
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="p-2 text-black rounded"
                  placeholder="Enter a new name"
                />
                <button
                  onClick={handleNameChange}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <h1
                className="text-3xl font-bold text-white cursor-pointer"
                onClick={() => setIsEditingName(true)}
              >
                {newName}
              </h1>
            )}
          </div>

          {/* Likes and Delete */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center text-red-500 hover:opacity-80"
            >
              <Heart className="w-5 h-5 mr-1" />
              <span>{likes}</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center text-white bg-red-500 px-3 py-2 rounded hover:bg-red-400"
            >
              <Trash className="w-5 h-5 mr-1" />
              Delete
            </button>
          </div>
        </div>

        {/* Asset Info */}
        <p className="text-gray-400 mb-2 capitalize">
          <strong>Type:</strong> {asset.type || "Unknown Type"}
        </p>
        <p className="text-gray-400 mb-6">
          <strong>Created:</strong>{" "}
          {asset.created ? new Date(asset.created).toLocaleDateString() : "N/A"}
        </p>

        {/* Backstory */}
        <h2 className="text-2xl font-bold text-white mb-4">Backstory</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          {asset.backstory || "No backstory available."}
        </p>

        {/* Visibility Toggle Buttons */}
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
        <p className="text-gray-400 mt-4">
          Current visibility:{" "}
          <span className="text-white">{isPublic ? "Public" : "Private"}</span>
        </p>

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
