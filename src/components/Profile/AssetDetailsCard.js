import { deletePrismaAsset, updatePrismaAssetInfo } from "@/api";
import CommentsSection from "@/components/Profile/CommentsSection";
import CreateCollectionForm from "@/components/Profile/CreateCollectionForm";
import styles from "@/styles/AssetDetailsCard.module.css"; // The CSS module
import { Heart, MoreHorizontal, Share2, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function AssetDetailsCard({ asset, onBack }) {
  const auth = useAuth();
  const user = auth.user;

  // Core asset states
  const [visibility, setVisibility] = useState(asset?.visibility || "private");
  const [name, setName] = useState(asset?.name || "Unnamed");
  const [description, setDescription] = useState(
    asset?.description || "No backstory available.",
  );

  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Likes & like toggle (local for now)
  const [likes, setLikes] = useState(asset?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  // Share tooltip
  const [copied, setCopied] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const defaultImage = "/placeholder/p01.png"; // fallback

  //collections
  const [userCollections, setUserCollections] = useState([]);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

  const collectionsDropdownRef = useRef(null);
  const starButtonRef = useRef(null);

  // ---- Handlers ----
  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    setShowCollectionDropdown(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        collectionsDropdownRef.current &&
        !collectionsDropdownRef.current.contains(event.target) &&
        starButtonRef.current &&
        !starButtonRef.current.contains(event.target)
      ) {
        setShowCollectionDropdown(false);
        setIsStarred(false); // Reset star color
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleAddToCollection = (collection) => {
    console.log(`Added ${asset.name} to collection: ${collection.name}`);
    setShowCollectionDropdown(false);
  };

  const handleCreateCollection = (newCollection) => {
    setUserCollections([...userCollections, newCollection]);
    setIsCreatingCollection(false);
    setShowCollectionDropdown(false);
  };
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (!isLiked ? prev + 1 : Math.max(prev - 1, 0)));
  };

  // Toggle between public/private
  const handleToggleVisibility = (newVisibility) => {
    setVisibility(newVisibility);
    console.log("Visibility:", newVisibility);
  };

  const handleSave = async () => {
    const newInfo = { name, description, visibility };
    console.log("Saving asset with info:", newInfo);
    try {
      await updatePrismaAssetInfo(user, asset.uuid, newInfo);
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

  // Trigger the delete modal
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await deletePrismaAsset(asset.id);
      onBack();
      setTimeout(() => {
        window.location.reload();
      }, 100);
      console.log("Asset deleted successfully!");
    } catch (error) {
      console.error("Failed to delete asset:", error);
    }
    setShowDeleteModal(false);
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // For the 3-dot edit menu
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- UI ----
  return (
    <div className={styles.assetCardContainer}>
      <div className={styles.assetCard}>
        {/* ASSET IMAGE */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.imageUrl || defaultImage}
          alt={asset.name || "Unknown Asset"}
          className="w-full rounded-lg mb-6"
        />

        {/* ASSET NAME + LIKE COUNT */}
        <div className="flex items-center justify-between mb-4">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-2xl font-bold text-black p-2 rounded w-2/3"
              placeholder="Enter Asset Name"
            />
          ) : (
            <h1 className="text-2xl font-bold text-white">{name}</h1>
          )}
          <div className="flex items-center text-red-500 ml-2">
            <Heart className="w-5 h-5 mr-1 fill-current" />
            <span className="text-white">{likes}</span>
          </div>
        </div>

        {/* Asset type area*/}
        <p className="text-gray-400 mb-2 capitalize">
          <strong>Type:</strong> {asset.type || "Unknown Type"}
        </p>
        <p className="text-gray-400 mb-6">
          <strong>Created:</strong>{" "}
          {asset.createdAt
            ? new Date(asset.createdAt).toISOString().split("T")[0]
            : "N/A"}
        </p>

        {/* BUTTON AREA: Like, Star, Share, Edit */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Like button */}
          {!isEditing && (
            <button
              onClick={handleLike}
              className={`${styles.roundedButton} w-10 h-10 hover:opacity-80 ${
                isLiked ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              <Heart className="w-5 h-5" fill="currentColor" />
            </button>
          )}

          {/* Star Button & Collection Dropdown */}
          {!isEditing && (
            <div className="relative" ref={collectionsDropdownRef}>
              <button
                ref={starButtonRef} // Reference the button
                onClick={handleStar}
                className={`w-10 h-10 ${styles.roundedButton} ${
                  isStarred ? "bg-yellow-500 text-black" : styles.bgGrayButton
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>

              {/* Collection Dropdown */}
              {!isEditing && showCollectionDropdown && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-md shadow-lg w-48 p-2 z-20">
                  {userCollections.length > 0 ? (
                    userCollections.map((collection) => (
                      <button
                        key={collection.id}
                        onClick={() => handleAddToCollection(collection)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                      >
                        {collection.name}
                      </button>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 py-2">
                      <p>No Collections found</p>
                      <button
                        onClick={() => setIsCreatingCollection(true)}
                        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
                      >
                        Create Collection
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Render `CreateCollectionForm` outside the small dropdown */}
              {!isEditing && isCreatingCollection && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-md z-50">
                  <div className="w-96 bg-gray-900 p-6 rounded-lg shadow-lg">
                    <CreateCollectionForm
                      onCancel={() => setIsCreatingCollection(false)}
                      onCreate={handleCreateCollection}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Share button + tooltip */}
          {!isEditing && (
            <div className="relative">
              <button
                onClick={handleShare}
                className={`w-10 h-10 ${styles.roundedButton} ${
                  copied ? styles.bgGreenButton : styles.bgGrayButton
                }`}
              >
                <Share2 className="w-5 h-5 text-white fill-current" />
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
          )}

          {/* 3-dot edit button + dropdown */}
          {!isEditing && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`w-10 h-10 ${styles.roundedButton} ${styles.bgGrayButton}`}
              >
                <MoreHorizontal className="w-5 h-5 text-white" />
              </button>
              {menuOpen && (
                <div className={styles.dropdownMenu}>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-green-700 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setShowDeleteModal(true);
                    }}
                    className="w-full text-left text-red-500 px-4 py-2 hover:bg-red-700 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BACKSTORY */}
        <h2 className="text-xl font-bold text-white mb-2">Backstory</h2>
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 text-black rounded mb-4"
            rows="4"
            placeholder="Enter Backstory"
          />
        ) : (
          <p className="text-gray-300 leading-relaxed mb-4">{description}</p>
        )}

        {/* VISIBILITY SLIDER: only if editing */}
        {isEditing && (
          <div className="flex items-center justify-center mb-4">
            <VisibilitySlider
              visibility={visibility}
              onToggle={handleToggleVisibility}
            />
          </div>
        )}

        {/* Current Visibility (if not editing) */}
        {!isEditing && (
          <p className="text-gray-400 mb-4">
            <strong>Visibility:</strong>{" "}
            <span className="text-white capitalize">{visibility}</span>
          </p>
        )}

        {/* Comments Section (Only show when not editing) */}
        {!isEditing && <CommentsSection commentCount={13} />}

        {/* SAVE / CANCEL(edit mode) */}
        {isEditing && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Back button */}
        {!isEditing && (
          <button
            onClick={onBack}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
          >
            Back
          </button>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <DeleteModal
          assetName={asset.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}

/* 
  1) VisibilitySlider: a pill-shaped slider with "Public" & "Private".
  2) DeleteModal: a popup confirmation with custom text & buttons.
*/

// 1) VisibilitySlider component
function VisibilitySlider({ visibility, onToggle }) {
  const isPublic = visibility === "public";

  // Toggle logic on label click
  const handleClick = (val) => {
    onToggle(val);
  };

  return (
    <div className="relative w-36 h-10 bg-gray-700 rounded-full flex items-center px-2 cursor-pointer select-none">
      {/* "Public" label */}
      <span
        onClick={() => handleClick("public")}
        className={`z-10 w-1/2 text-center text-sm transition-colors duration-200 ${
          isPublic ? "text-black" : "text-gray-400"
        }`}
      >
        Public
      </span>

      {/* "Private" label */}
      <span
        onClick={() => handleClick("private")}
        className={`z-10 w-1/2 text-center text-sm transition-colors duration-200 ${
          !isPublic ? "text-black" : "text-gray-400"
        }`}
      >
        Private
      </span>

      {/* Sliding background highlight */}
      <div
        className={`absolute top-1 bottom-1 left-1 w-1/2 bg-white rounded-full shadow transform transition-transform duration-300 ${
          !isPublic ? "translate-x-16" : "translate-x-0"
        }`}
      ></div>
    </div>
  );
}

// 2) DeleteModal component
function DeleteModal({ assetName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal box */}
      <div className="bg-white text-black rounded-md p-6 w-80 text-center">
        <h2 className="text-xl font-bold mb-2">
          Are you sure you want to delete <br />
          <span className="text-red-600">{assetName}</span>?
        </h2>
        <p className="mb-4">This action can’t be undone!</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 font-bold py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
          >
            DELETE
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 font-bold bg-gray-300 text-black rounded-md hover:bg-gray-400"
          >
            GO BACK
          </button>
        </div>
      </div>
    </div>
  );
}
