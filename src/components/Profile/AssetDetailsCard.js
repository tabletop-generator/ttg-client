/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import {
  addAssetsToCollection,
  deletePrismaAsset,
  getCollection,
  postCollection,
  updatePrismaAssetInfo,
} from "@/api";
import CommentsSection from "@/components/Profile/CommentsSection";
import CreateCollectionForm from "@/components/Profile/CreateCollectionForm";
import styles from "@/styles/AssetDetailsCard.module.css"; // The CSS module
import { Heart, MoreHorizontal, Share2, Star } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
export default function AssetDetailsCard({
  user,
  isMyAsset,
  hashedEmail,
  asset,
  userCollections,
  setUserCollections,
  onBack,
}) {
  const auth = useAuth();
  const cognitoUser = auth.user;
  const router = useRouter();
  const userColl = user?.collections ? [...user.collections] : [];

  console.log("Is this my asset:", isMyAsset);
  // Core asset states
  const [visibility, setVisibility] = useState(asset?.visibility || "private");
  const [name, setName] = useState(asset?.name || "Unnamed");
  const [description, setDescription] = useState(
    asset?.description || "No backstory available.",
  );

  // UI states
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);
  const [likes, setLikes] = useState(asset?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [shareMessageType, setShareMessageType] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isInCollection, setIsInCollection] = useState(false);

  const defaultImage = "/placeholder/p01.png"; // fallback image

  const collectionsDropdownRef = useRef(null);
  const starButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  //checking to see if asset is in a collection for the star to be highlighted
  /*
  TO PROPERLY TEST/CONNECT WHEN BACKEND API IS WORKING
  */
  const isAssetInCollection = async (assetUuid) => {
    const collection = await getCollection(cognitoUser);
    if (!collection || !collection.assets) return false;
    return collection.assets.some((mockAsset) => mockAsset.id === assetUuid);
  };

  useEffect(() => {
    (async () => {
      if (await isAssetInCollection(asset.uuid)) {
        console.log("This asset is in the collection.");
        setIsInCollection(true);
      } else {
        console.log("Asset not found in the collection.");
        setIsInCollection(false);
      }
    })();
  }, [asset]);

  // ---- HANDLERS ----
  const handleShare = () => {
    if (visibility === "private") {
      setShareMessage(
        "Your asset is private, can't share private secrets. Make it public and try again.",
      );
      setShareMessageType("error");
      setTimeout(() => {
        setShareMessage("");
        setShareMessageType("");
      }, 5000);
      return;
    }

    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setShareMessage("Copied to Clipboard!");
        setShareMessageType("success");
        setTimeout(() => {
          setShareMessage("");
          setShareMessageType("");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        setShareMessage("Failed to copy");
        setShareMessageType("error");
        setTimeout(() => {
          setShareMessage("");
          setShareMessageType("");
        }, 2000);
      });
  };

  const handleBack = () => {
    if (!isMyAsset) {
      const previousPage = sessionStorage.getItem("previousPage");

      if (previousPage) {
        router.push(previousPage); // Go to stored page
        sessionStorage.removeItem("previousPage"); // Clear it after use
      } else {
        router.push("/profile?tab=assets"); // Default fallback
      }
    } else {
      router.push("/profile?tab=assets"); // Always return to user's assets
    }
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    setShowCollectionDropdown(true);
  };

  // Close the collection dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        collectionsDropdownRef.current &&
        !collectionsDropdownRef.current.contains(event.target) &&
        starButtonRef.current &&
        !starButtonRef.current.contains(event.target)
      ) {
        setShowCollectionDropdown(false);
        setIsStarred(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handler when a collection is selected from the dropdown.
  // Uses the passed collection's ID to add the asset.
  const handleAddToCollection = async (collection) => {
    try {
      await addAssetsToCollection(cognitoUser, collection.id, [asset.uuid]);
      console.log(`Added ${asset.name} to collection: ${collection.name}`);
      setIsInCollection(true);
    } catch (error) {
      console.error("Failed to add asset:", error);
    }
    setShowCollectionDropdown(false);
  };

  // ---- CREATE COLLECTION HANDLER ----
  // calling API to create a new collection,
  // and then attempts to add the current asset to the newly created collection.
  const handleCreateCollection = async (newCollection) => {
    if (!setUserCollections) {
      console.error("setUserCollections is undefined!");
      return;
    }

    try {
      // Ensure the user is authenticated and has an id_token
      if (!cognitoUser?.id_token) {
        console.error("User is not authenticated!");
        return;
      }

      // Combine the user object with the id_token
      const combinedUser = { ...user, id_token: cognitoUser.id_token };

      // Call API to create the collection
      const response = await postCollection(combinedUser, newCollection);

      if (response && response.data) {
        const createdCollection = response.data.collection;
        console.log("Created Collection:", createdCollection);

        // Update the collections state with the newly created collection
        setUserCollections((prevCollections) => [
          ...prevCollections,
          createdCollection,
        ]);

        // Add the current asset to the newly created collection
        try {
          await addAssetsToCollection(cognitoUser, createdCollection.id, [
            asset.uuid,
          ]);
          console.log(
            `Added ${asset.name} to the newly created collection: ${createdCollection.name}`,
          );
        } catch (error) {
          console.error("Failed to add asset to new collection:", error);
        }

        // Close the create collection form and dropdown
        setIsCreatingCollection(false);
        setShowCollectionDropdown(false);
      } else {
        console.error("Failed to create collection, response:", response);
      }
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (!isLiked ? prev + 1 : Math.max(prev - 1, 0)));
  };

  const handleToggleVisibility = (newVisibility) => {
    setVisibility(newVisibility);
    console.log("Visibility:", newVisibility);
  };

  const handleSave = async () => {
    const newInfo = { name, description, visibility };
    console.log("Saving asset with info:", newInfo);

    try {
      await updatePrismaAssetInfo(cognitoUser, asset.uuid, newInfo);
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

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePrismaAsset(cognitoUser, asset.uuid);
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

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Close the 3-dot menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- UI RENDERING ----
  return (
    <div className={styles.assetCardContainer}>
      <div className={styles.assetCard}>
        {/* Asset Image */}
        <img
          src={asset.imageUrl || defaultImage}
          alt={asset.name || "Unknown Asset"}
          className="w-full rounded-lg mb-6"
        />

        {/* Asset Name & Like Count */}
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
        {/* Created By, Asset Type and Created Date */}
        <p className="text-gray-400 mb-2 capitalize">
          <strong>Created By:</strong> {asset.creatorName}
        </p>
        <p className="text-gray-400 mb-2 capitalize">
          <strong>Type:</strong> {asset.type || "Unknown Type"}
        </p>
        <p className="text-gray-400 mb-6">
          <strong>Created:</strong>{" "}
          {asset.createdAt
            ? new Date(asset.createdAt).toISOString().split("T")[0]
            : "N/A"}
        </p>
        {!isEditing && (
          <p className="text-gray-400 mb-4">
            <strong>Visibility:</strong>{" "}
            <span className="text-white capitalize">{visibility}</span>
          </p>
        )}
        {/* Buttons: Like, Star (for collection), Share, Edit */}
        <div className="flex items-center justify-center gap-4 mb-6">
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
                ref={starButtonRef}
                onClick={handleStar}
                className={`w-10 h-10 ${styles.roundedButton} ${
                  isInCollection
                    ? "bg-yellow-500 text-black"
                    : styles.bgGrayButton
                }`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>

              {/* Collection Dropdown */}
              {!isEditing && showCollectionDropdown && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-md shadow-lg w-48 p-2 z-20">
                  {userColl.length > 0 ? (
                    userColl.map((collection) => (
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

              {/* Create Collection Modal */}
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

          {/* Share Button */}
          {!isEditing && (
            <div className="relative">
              <button
                onClick={handleShare}
                className={`w-10 h-10 ${styles.roundedButton} ${
                  shareMessageType === "success"
                    ? styles.bgGreenButton
                    : styles.bgGrayButton
                }`}
              >
                <Share2 className="w-5 h-5 text-white fill-current" />
              </button>
              {shareMessage && (
                <div
                  className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transform px-3 py-1 text-sm rounded shadow-lg z-10 whitespace-nowrap ${
                    shareMessageType === "error"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {shareMessage}
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

          {/* 3-dot Edit Menu */}
          {!isEditing && isMyAsset && (
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

        {/* Asset Description / Backstory */}
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

        {/* Asset Visibility Controls */}
        {isEditing && (
          <div className="flex items-center justify-center mb-4">
            <VisibilitySlider
              visibility={visibility}
              onToggle={handleToggleVisibility}
            />
          </div>
        )}

        {/* Comments Section */}
        {!isEditing && <CommentsSection commentCount={13} />}

        {/* Save / Cancel buttons for editing */}
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
            onClick={handleBack}
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

  const handleClick = (val) => {
    onToggle(val);
  };

  return (
    <div className="relative w-36 h-10 bg-gray-700 rounded-full flex items-center px-2 cursor-pointer select-none">
      <span
        onClick={() => handleClick("public")}
        className={`z-10 w-1/2 text-center text-sm transition-colors duration-200 ${
          isPublic ? "text-black" : "text-gray-400"
        }`}
      >
        Public
      </span>
      <span
        onClick={() => handleClick("private")}
        className={`z-10 w-1/2 text-center text-sm transition-colors duration-200 ${
          !isPublic ? "text-black" : "text-gray-400"
        }`}
      >
        Private
      </span>
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
