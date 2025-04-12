/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import {
  addAssetsToCollection,
  deletePrismaAsset,
  getCollection,
  getCollectionById,
  likeAsset,
  postCollection,
  unlikeAsset,
  updatePrismaAssetInfo,
} from "@/api";
import CommentsSection from "@/components/Profile/CommentsSection";
import CreateCollectionForm from "@/components/Profile/CreateCollectionForm";
import styles from "@/styles/AssetDetailsCard.module.css";
import { Heart, MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function AssetDetailsCard({
  user,
  hashedEmail,
  asset,
  userCollections = [],
  setUserCollections,
  onBack,
  isMyAsset,
  isAuthenticated = true,
  isGuestPreview = false, // guest preview mode
}) {
  const auth = useAuth();
  const router = useRouter();
  const cognitoUser = auth.user;
  const [userColl, setUserColl] = useState([]);
  const [showGuestBanner, setShowGuestBanner] = useState(true);

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isInCollection, setIsInCollection] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loginPromptVisible, setLoginPromptVisible] =
    useState(!isAuthenticated);

  const defaultImage = "/placeholder/p01.png"; // fallback image

  const collectionsDropdownRef = useRef(null);
  const starButtonRef = useRef(null);
  const dropdownRef = useRef(null);

  // For unauthenticated users, show a login prompt for certain actions
  const handleUnauthenticatedAction = (actionType) => {
    const confirmLogin = window.confirm(
      `You need to be logged in to ${actionType} this asset. Would you like to log in now?`,
    );

    if (confirmLogin) {
      auth.signinRedirect(); // Redirect to login
    }
  };

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionResponse = await getCollection(
          auth.user,
          user.hashedEmail,
        );
        if (collectionResponse && collectionResponse.collections) {
          console.log(collectionResponse);
          setUserColl(collectionResponse.collections);
        } else {
          console.warn("Unexpected collection response:", collectionResponse);
        }
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    if (auth.user && user?.hashedEmail) {
      fetchCollections();
    }
  }, [auth.user, user?.hashedEmail]);

  // Initialize isLiked state based on asset.likedBy
  useEffect(() => {
    if (asset.likedBy && user?.hashedEmail) {
      setIsLiked(asset.likedBy.includes(user.hashedEmail));
    }
  }, [asset.likedBy, user]);

  // Check if asset is in a collection
  const isAssetInAnyCollection = async (assetUuid) => {
    if (!assetUuid || !isAuthenticated || !userColl.length) return false;

    try {
      // Loop through each collection stored in state
      for (const coll of userColl) {
        // If assets are already loaded in the collection, use them
        let assets = coll.assets;

        // If not, fetch the collection details to get its assets
        if (!assets) {
          const res = await getCollectionById(cognitoUser, coll.id);
          assets = res?.collection?.assets || [];
        }

        const match = assets.some((entry) => {
          if (typeof entry === "string") {
            return entry === assetUuid;
          } else {
            return entry.uuid === assetUuid || entry.id === assetUuid;
          }
        });
        if (match) return true;
      }
      return false;
    } catch (err) {
      console.error("Error fetching collection assets:", err);
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      if (asset?.uuid && isAuthenticated) {
        try {
          const found = await isAssetInAnyCollection(asset.uuid);
          console.log("Asset in any collection:", found);
          setIsInCollection(found);
        } catch (error) {
          console.error("Error checking collection status:", error);
          setIsInCollection(false);
        }
      } else {
        setIsInCollection(false);
      }
    })();
  }, [asset, isAuthenticated, userColl]);

  const handleDismissGuestBanner = () => {
    setShowGuestBanner(false);

    // Save the dismissal time to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("guestBannerDismissed", Date.now().toString());
    }
  };

  // Check localStorage on component mount to decide if banner should be shown
  useEffect(() => {
    if (typeof window !== "undefined" && isGuestPreview) {
      const lastDismissed = localStorage.getItem("guestBannerDismissed");

      if (lastDismissed) {
        const dismissedTime = parseInt(lastDismissed, 10);
        const fourHoursInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

        // Only show banner if it's been at least 4 hours since last dismissal
        if (Date.now() - dismissedTime < fourHoursInMs) {
          setShowGuestBanner(false);
        }
      }
    }
  }, [isGuestPreview]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      const lastDismissed = localStorage.getItem("loginPromptDismissed");

      if (lastDismissed) {
        const dismissedTime = parseInt(lastDismissed, 10);
        const fourHoursInMs = 4 * 60 * 60 * 1000;

        if (Date.now() - dismissedTime < fourHoursInMs) {
          setLoginPromptVisible(false);
        }
      }
    }
  }, [isAuthenticated]);

  const handleStar = () => {
    if (!isAuthenticated) {
      handleUnauthenticatedAction("add to collection");
      return;
    }

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
  const handleAddToCollection = async (collection) => {
    if (!isAuthenticated) {
      handleUnauthenticatedAction("add to collection");
      return;
    }

    try {
      await addAssetsToCollection(cognitoUser, collection.id, [asset.uuid]);
      console.log(`Added ${asset.name} to collection: ${collection.name}`);
      setIsInCollection(true);
    } catch (error) {
      console.error("Failed to add asset:", error);
    }
    setShowCollectionDropdown(false);
  };

  // Create collection handler
  const handleCreateCollection = async (newCollection) => {
    if (!isAuthenticated) {
      handleUnauthenticatedAction("create collection");
      return;
    }

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
          setIsInCollection(true);
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

  const handleToggleVisibility = async (newVisibility) => {
    // If we're in editing mode, just update the state (it will be saved with all changes on "Save")
    if (isEditing) {
      setVisibility(newVisibility);
      console.log("Visibility updated to:", newVisibility);
      return;
    }

    // If not in editing mode, update state and save immediately
    setVisibility(newVisibility);
    console.log("Saving visibility change to:", newVisibility);

    // Show a saving indicator
    setIsSaving(true);

    try {
      // Ensure we have the right ID format
      const assetId = asset?.uuid || asset?.id;

      // Only update the visibility field
      const newInfo = { visibility: newVisibility };

      // Perform the update
      await updatePrismaAssetInfo(cognitoUser, assetId, newInfo);
      console.log("Asset visibility updated successfully");
    } catch (error) {
      console.error("Error updating asset visibility:", error);
      // Revert to previous visibility state on error
      setVisibility(visibility);
      alert("Failed to update visibility. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      handleUnauthenticatedAction("like/unlike");
      return;
    }
    try {
      if (isLiked) {
        // Asset is liked, so unlike it
        const response = await unlikeAsset(cognitoUser, asset.uuid);
        setLikes(response.likes);
        setIsLiked(false);
      } else {
        // Asset is not liked, so like it
        const response = await likeAsset(cognitoUser, asset.uuid);
        setLikes(response.likes);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like on asset:", error);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated || !isMyAsset) {
      console.error("User not authorized to edit this asset");
      return;
    }

    const newInfo = { name, description, visibility };
    console.log("Saving asset with info:", newInfo);

    setIsSaving(true);

    try {
      // Ensure we have the right ID format
      const assetId = asset?.uuid || asset?.id;
      console.log("Saving changes for asset ID:", assetId);

      if (!assetId) {
        console.error("Missing asset ID - cannot save changes");
        alert("Unable to save changes: Missing asset identifier");
        setIsSaving(false);
        return;
      }

      // Perform the update
      await updatePrismaAssetInfo(cognitoUser, assetId, newInfo);
      console.log("Asset updated successfully");

      // Update local state
      asset.visibility = visibility;
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating asset:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(asset?.name || "Unnamed");
    setDescription(asset?.description || "No backstory available.");
    setVisibility(asset?.visibility || "private");
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (!isAuthenticated || !isMyAsset) {
      console.error("User not authorized to delete this asset");
      return;
    }

    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!isAuthenticated || !isMyAsset) {
      console.error("User not authorized to delete this asset");
      setShowDeleteModal(false);
      return;
    }

    try {
      await deletePrismaAsset(cognitoUser, asset.uuid);

      // After successful deletion, navigate back to profile
      router.push("/profile?tab=assets");
    } catch (error) {
      console.error("Failed to delete asset:", error);
    }
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Handle click on creator name to view their profile
  const handleViewCreatorProfile = () => {
    if (asset.user?.hashedEmail) {
      router.push(`/profile/user/${asset.user.hashedEmail}`);
    }
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

        {/* Enhanced Guest Preview Mode Banner - Only show if not dismissed */}
        {isGuestPreview && showGuestBanner && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-lg mb-4">
            <p className="font-bold text-xl mb-2">Guest Preview Mode</p>
            <p className="mb-3">
              You are viewing this asset in limited preview mode. Log in to see
              full details, like assets, add to collections, and more!
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => auth.signinRedirect()}
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-100 font-bold"
              >
                Sign In
              </button>
              <button
                onClick={handleDismissGuestBanner}
                className="text-white underline"
              >
                Continue as guest
              </button>
            </div>
          </div>
        )}

        {/* Login prompt for unauthenticated users */}
        {!isGuestPreview && loginPromptVisible && !isAuthenticated && (
          <div className="bg-indigo-600 text-white p-4 rounded-lg mb-4">
            <p className="font-bold">Want full interaction with this asset?</p>
            <p className="text-sm mb-2">
              Log in to like, save to collections, and more!
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => auth.signinRedirect()}
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-100"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setLoginPromptVisible(false);
                  localStorage.setItem(
                    "loginPromptDismissed",
                    Date.now().toString(),
                  );
                }}
                className="text-white underline"
              >
                Continue as guest
              </button>
            </div>
          </div>
        )}

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
          <strong>Created By:</strong>{" "}
          {/* Make creator name a clickable link to their profile */}
          {asset.user?.hashedEmail ? (
            <Link
              href={`/profile/user/${asset.user.hashedEmail}`}
              className="text-indigo-400 hover:text-indigo-300"
            >
              {asset.creatorName || "Unknown Creator"}
            </Link>
          ) : (
            asset.creatorName || "Unknown Creator"
          )}
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

        {/* Visibility Controls - only show when owner & NOT editing */}
        {isMyAsset && !isEditing && (
          <div className="mt-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <strong className="text-gray-400">Visibility:</strong>
              <span className="text-white capitalize">{visibility}</span>
              {isSaving && <span className="text-yellow-400">(Saving...)</span>}
            </div>
            <div className="flex items-center justify-center">
              <VisibilitySlider
                visibility={visibility}
                onToggle={handleToggleVisibility}
              />
            </div>
          </div>
        )}

        {/* Buttons: Like, Star (for collection), Edit */}
        {!isEditing && (
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Like Button */}
            <button
              onClick={handleToggleLike}
              className={`${styles.roundedButton} w-10 h-10 hover:opacity-80 ${
                isLiked ? "bg-red-500 text-white" : "bg-gray-700 text-gray-300"
              }`}
              title="Like this asset"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
            </button>

            {/* Star/Collection Button */}
            <div className="relative" ref={collectionsDropdownRef}>
              <button
                ref={starButtonRef}
                onClick={handleStar}
                className={`w-10 h-10 ${styles.roundedButton} ${
                  isInCollection
                    ? "bg-yellow-500 text-black"
                    : styles.bgGrayButton
                }`}
                title="Add to collection"
              >
                <Star className="w-5 h-5 fill-current" />
              </button>

              {/* Collection Dropdown - Only shown for authenticated users */}
              {isAuthenticated && showCollectionDropdown && (
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
              {isCreatingCollection && (
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

            {/* 3-dot Edit Menu - Only show if user owns the asset */}
            {isMyAsset && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`w-10 h-10 ${styles.roundedButton} ${styles.bgGrayButton}`}
                  title="More options"
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
        )}

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

        {/* Visibility Controls - only show when editing */}
        {isEditing && (
          <div className="flex items-center justify-center mb-4">
            <VisibilitySlider
              visibility={visibility}
              onToggle={handleToggleVisibility}
            />
          </div>
        )}

        {/* Comments Section - only show if not editing */}
        {!isEditing && (
          <CommentsSection
            asset={asset}
            user={user}
            cognitoUser={cognitoUser}
          />
        )}

        {/* Save / Cancel buttons for editing */}
        {isEditing && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 ${
                isSaving ? "bg-green-800" : "bg-green-600 hover:bg-green-500"
              } text-white rounded-md`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Back button - only show when not editing */}
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
        <p className="mb-4">This action cannot be undone!</p>
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
