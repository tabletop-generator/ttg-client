import { updateCollectionDetails } from "@/api";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

export default function EditCollectionForm({ collection, onCancel, onUpdate }) {
  const router = useRouter();
  const auth = useAuth();
  const user = auth.user;
  const [name, setName] = useState(collection.name);
  const [visibility, setVisibility] = useState(
    collection.visibility || "private",
  );

  const handleSave = async () => {
    const details = { name, visibility };
    try {
      const response = await updateCollectionDetails(
        user,
        collection.id,
        details,
      );
      onUpdate(response.collection);
      router.reload();
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <div className="w-96 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Edit Collection</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Collection Name"
          className="w-full p-2 mb-4 text-black rounded-md"
        />
        <div className="mb-4">
          <label className="block text-white mb-2">Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full p-2 rounded-md text-black"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
