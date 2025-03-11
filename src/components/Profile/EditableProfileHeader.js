import { useState } from "react";

function isValidObjectURL(url) {
  const pattern = /^blob:(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]$/i;
  return pattern.test(url);
}

export default function EditableProfileHeader({
  username,
  profilePhoto,
  bio,
  onSave,
}) {
  const [editableName, setEditableName] = useState(username);
  const [editableBio, setEditableBio] = useState(bio);
  const [selectedPhoto, setSelectedPhoto] = useState(profilePhoto);
  const [isEditing, setIsEditing] = useState(true); // Start in edit mode

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, or GIF).");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      if (isValidObjectURL(imageUrl)) {
        setSelectedPhoto(imageUrl);
      } else {
        alert("Invalid image URL.");
        return;
      }
      setIsModalOpen(false);
    }
  };

  const handleSelectDefaultPhoto = (photoUrl) => {
    setSelectedPhoto(photoUrl);
    setIsModalOpen(false);
  };

  return isEditing ? (
    <div className="text-center mb-6">
      {/* Profile Photo */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedPhoto}
          alt={`${username}'s profile`}
          className="w-32 h-32 mx-auto rounded-full shadow-2xl mb-4"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Edit Photo
        </button>
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
          onClick={() => {
            onSave(editableName, editableBio, selectedPhoto);
            setIsEditing(false); // Exit edit mode after saving
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
        >
          Save
        </button>
        <button
          onClick={() => {
            setEditableName(username);
            setEditableBio(bio);
            setSelectedPhoto(profilePhoto);
            setIsEditing(false); // Exit edit mode and go back to view mode
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
        >
          Cancel
        </button>
      </div>

      {/* Modal for Selecting Photo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
            <h3 className="text-xl font-bold mb-4">
              Forge Your Legend Choose Avatar
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Default Dwarf Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/placeholder/p03.png"
                alt="Dwarf"
                className="w-24 h-24 rounded-full cursor-pointer hover:opacity-75"
                onClick={() => handleSelectDefaultPhoto("/placeholder/p03.png")}
              />
              {/* Default Bard Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/placeholder/p02.png"
                alt="Bard"
                className="w-24 h-24 rounded-full cursor-pointer hover:opacity-75"
                onClick={() => handleSelectDefaultPhoto("/placeholder/p02.png")}
              />
              {/* Upload Button */}
              <div className="flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
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
        onClick={() => setIsEditing(true)} // Enter edit mode
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
      >
        Edit Profile
      </button>
    </div>
  );
}
