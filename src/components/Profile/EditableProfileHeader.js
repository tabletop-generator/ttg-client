/* eslint-disable @next/next/no-img-element */
import { updatePrismaUserInfo } from "@/api";
import { useState } from "react";

export default function EditableProfileHeader({
  username,
  profilePhoto,
  bio,
  userToken,
  hashedEmail,
}) {
  const [editableName, setEditableName] = useState(username);
  const [editableBio, setEditableBio] = useState(bio);
  const [selectedPhoto, setSelectedPhoto] = useState(profilePhoto);
  const [isEditing, setIsEditing] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    const newInfo = {
      displayName: editableName,
      profileBio: editableBio,
    };

    try {
      const response = await updatePrismaUserInfo(
        userToken,
        hashedEmail,
        newInfo,
      );

      console.log("User updated successfully:", response);
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("There was an error updating your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return isEditing ? (
    <div className="text-center mb-6">
      {/* Profile Photo */}
      <div className="relative">
        <img
          src={selectedPhoto}
          alt={`${username}'s profile`}
          className="w-32 h-32 mx-auto rounded-full shadow-2xl mb-4"
        />
      </div>

      {/* Editable Username */}
      <input
        type="text"
        value={editableName}
        onChange={(e) => setEditableName(e.target.value)}
        className="mt-4 px-4 py-2 w-full bg-gray-800 text-white rounded-md"
        placeholder="Enter your name"
      />

      {/* Editable Bio */}
      <textarea
        value={editableBio}
        onChange={(e) => setEditableBio(e.target.value)}
        className="mt-4 px-4 py-2 w-full bg-gray-800 text-white rounded-md"
        placeholder="Enter your bio"
        rows="3"
      />

      {/* Save and Cancel Buttons */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => {
            setEditableName(username);
            setEditableBio(bio);
            setSelectedPhoto(profilePhoto);
            setIsEditing(false);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
        >
          Cancel
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Modal for Selecting Photo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
            <h3 className="text-xl font-bold mb-4">
              Forge Your Legend Choose Avatar
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <img
                src="/placeholder/p03.png"
                alt="Dwarf"
                className="w-24 h-24 rounded-full cursor-pointer hover:opacity-75"
                onClick={() => setSelectedPhoto("/placeholder/p03.png")}
              />
              <img
                src="/placeholder/p02.png"
                alt="Bard"
                className="w-24 h-24 rounded-full cursor-pointer hover:opacity-75"
                onClick={() => setSelectedPhoto("/placeholder/p02.png")}
              />
              <div className="flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => setSelectedPhoto(e.target.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="upload-photo"
                />
                <label
                  htmlFor="upload-photo"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-500"
                >
                  Upload
                </label>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="text-center mb-6">
      {/* Profile Photo */}
      <div className="relative">
        <img
          src={profilePhoto}
          alt={`${username}'s profile`}
          className="w-32 h-32 mx-auto rounded-full shadow-2xl mb-4"
        />
      </div>

      {/* Username and Bio Display */}
      <h4 className="text-2xl font-bold text-white">{username}</h4>
      <p className="text-sm text-gray-400 italic mt-2">{bio}</p>

      {/* Edit Button */}
      <button
        onClick={() => setIsEditing(true)}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
      >
        Edit Profile
      </button>
    </div>
  );
}
