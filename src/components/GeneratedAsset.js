import { useState } from "react";

export default function GeneratedAsset({ onBack, data }) {
  const placeholderImages = {
    locations: "/placeholder/card_environment.png",
    characters: "/placeholder/card_character.png",
    quests: "/placeholder/card_quest.png",
    maps: "/placeholder/card_map.png",
  };

  const assetStory = {
    locations: "Description",
    maps: "Backstory",
    characters: "Backstory",
    quests: "Story",
  };

  const imageSrc = placeholderImages[data?.id] || "/placeholder/default.png";
  const assetStoryTitle = assetStory[data?.id] || "Story";
  const [visibility, setVisibility] = useState("Public");
  const [name, setName] = useState(data?.name || "Unnamed");
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode
  const [tempName, setTempName] = useState(name); // Temporary name while editing

  const handleVisibilityChange = (option) => {
    setVisibility(option);
  };

  const startEditing = () => {
    setTempName(name); // Set temporary name to the current name
    setIsEditing(true);
  };

  const saveName = () => {
    setName(tempName); // Save the updated name
    setIsEditing(false); // Exit edit mode
  };

  const cancelEditing = () => {
    setIsEditing(false); // Exit edit mode without saving
  };

  const formattedId = data?.id
    ? data.id.charAt(0).toUpperCase() + data.id.slice(1).toLowerCase()
    : "Unknown";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-900 rounded-lg shadow-lg p-5 text-center w-4/5 max-w-4xl">
        {/* Image Section */}
        <img
          src={imageSrc}
          alt={`${data?.id || "Unknown"} Asset`}
          className="w-100 h-100 mx-auto rounded-md shadow-2xl"
        />

        {/* Asset Name Section */}
        <h4 className="text-2xl font-bold text-white mt-4">
          Your {formattedId} Name
        </h4>
        <div className="flex flex-col items-center justify-center mt-4 space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4">
          {isEditing ? (
            <>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full sm:w-auto bg-gray-700 text-white rounded-md px-4 py-2 text-center"
              />
              <button
                onClick={saveName}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 w-full sm:w-auto"
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 w-full sm:w-auto"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={name}
                readOnly
                className="w-full sm:w-auto bg-gray-700 text-white rounded-md px-4 py-2 text-center"
              />
              <button
                onClick={startEditing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 w-full sm:w-auto"
              >
                Change
              </button>
            </>
          )}
        </div>

        {/* Visibility Toggle Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => handleVisibilityChange("Public")}
            className={`px-4 py-2 rounded-md ${
              visibility === "Public"
                ? "bg-gray-400 text-black"
                : "bg-gray-600 text-white"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => handleVisibilityChange("Private")}
            className={`px-4 py-2 rounded-md ${
              visibility === "Private"
                ? "bg-gray-400 text-black"
                : "bg-gray-600 text-white"
            }`}
          >
            Private
          </button>
        </div>
        <p className="text-gray-400 mt-4">
          Current visibility: <span className="text-white">{visibility}</span>
        </p>

        {/* Backstory Section */}
        <h4 className="text-2xl font-bold text-white mt-7">
          <i>{assetStoryTitle}</i>
        </h4>
        {data?.generated && Object.keys(data.generated).length > 0 ? (
          <pre className="text-sm text-gray-500 mt-4 bg-gray-700 p-4 rounded-md">
            {JSON.stringify(data.generated, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-gray-400 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </p>
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
