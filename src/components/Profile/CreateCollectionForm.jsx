import { useState } from "react";

export default function CreateCollectionForm({ onCancel, onCreate }) {
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState("private"); // Default to private

  // Toggle visibility between public and private
  const handleToggleVisibility = () => {
    setVisibility((prev) => (prev === "public" ? "private" : "public"));
  };

  const handleCreate = () => {
    // Create a collection object with only the entered values
    const newCollection = {
      name,
      visibility,
    };

    // Call the parent function with the new collection
    onCreate(newCollection);

    // Reset fields (optional)
    setName("");
    setVisibility("private");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Create Collection</h2>

      {/* Collection Name Input */}
      <input
        type="text"
        placeholder="Collection Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 text-black rounded-md"
      />

      {/* Visibility Toggle */}
      <div className="flex flex-col items-center justify-center mb-5">
        {/* Centered Label */}
        <span className="text-white mb-2 text-sm font-medium">Visibility</span>

        {/* Toggle Button */}
        <div
          className="relative w-40 h-12 bg-gray-700 rounded-full flex cursor-pointer select-none"
          onClick={handleToggleVisibility}
        >
          {/* Sliding background highlight */}
          <div
            className={`absolute inset-y-1 left-1 w-[50%] bg-white rounded-full shadow transition-transform duration-300 ${
              visibility === "private"
                ? "translate-x-[calc(100%-6px)]"
                : "translate-x-0"
            }`}
          ></div>

          {/* Public label */}
          <span
            className={`absolute left-5 top-1/2 -translate-y-1/2 text-base font-medium transition-colors duration-200 ${
              visibility === "public" ? "text-black" : "text-gray-300"
            }`}
          >
            Public
          </span>

          {/* Private label */}
          <span
            className={`absolute right-5 top-1/2 -translate-y-1/2 text-base font-medium transition-colors duration-200 ${
              visibility === "private" ? "text-black" : "text-gray-300"
            }`}
          >
            Private
          </span>
        </div>
      </div>

      {/* Button*/}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!name.trim()} // Disable if name is empty
          className={`px-4 py-2 rounded-md ${
            name.trim()
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-gray-600 text-gray-400"
          }`}
        >
          Create
        </button>
      </div>
    </div>
  );
}
