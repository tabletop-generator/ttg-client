/* eslint-disable @next/next/no-img-element */
import {
  addAssetsToCollection,
  deleteCollectionById,
  getAssetByID,
  getCollectionById,
  removeAssetsFromCollection,
} from "@/api";
import EditCollectionForm from "@/components/Profile/EditCollectionForm";
import styles from "@/styles/CollectionDetails.module.css";
import { MoreHorizontal, Plus, Share2, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function CollectionDetails({
  collection,
  user,
  setUser,
  userCollections,
  onBack,
  allAssets,
  isOwnProfile = true, // Default true for backward compatibility
}) {
  const auth = useAuth();
  const router = useRouter();
  const cognitoUser = auth.user;

  const [showAssetGrid, setShowAssetGrid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ownerId, setOwnerId] = useState(null);
  // State for full collection details
  const [currentCollection, setCurrentCollection] = useState(collection);
  const [updatedAssets, setUpdatedAssets] = useState([]);
  const [shareMessage, setShareMessage] = useState("");
  const [shareMessageType, setShareMessageType] = useState("");
  const dropdownRef = useRef(null);

  // Check if the current user owns this collection either by prop or owner ID comparison
  const isCollectionOwner =
    isOwnProfile ||
    user?.hashedEmail === ownerId ||
    user?.hashedEmail === collection?.ownerId;

  // Combine user objects to include id_token
  const combinedUser =
    user && cognitoUser ? { ...user, id_token: cognitoUser.id_token } : null;

  // Fetch full collection details and load expanded asset details
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      if (!cognitoUser?.id_token || !collection?.id) return;
      try {
        console.log(`Fetching collection details for ID: ${collection.id}`);
        const response = await getCollectionById(cognitoUser, collection.id);
        if (response && response.collection) {
          const collectionData = response.collection;
          setCurrentCollection(collectionData);
          setOwnerId(collectionData.ownerId);

          if (collectionData.assets && collectionData.assets.length > 0) {
            const fullAssets = await Promise.all(
              collectionData.assets.map(async (assetEntry, index) => {
                // Extract UUID whether assetEntry is a string or an object
                const uuid =
                  typeof assetEntry === "string" ? assetEntry : assetEntry.uuid;
                console.log(`Fetching asset ${index + 1} with uuid: ${uuid}`);
                const assetResponse = await getAssetByID(cognitoUser, uuid);
                return assetResponse?.data?.asset || null;
              }),
            );
            const validAssets = fullAssets.filter((asset) => asset !== null);
            setUpdatedAssets(validAssets);
          }
        }
      } catch (error) {
        console.error(`Error fetching collection ${collection.id}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetails();
  }, [cognitoUser, collection.id]);

  // Handle adding an asset (only for collection owner)
  const handleAddAsset = async (asset) => {
    if (!isCollectionOwner) {
      console.warn("Cannot add assets to someone else's collection");
      return;
    }
    if (!cognitoUser?.id_token) {
      console.error("User authentication token is missing");
      return;
    }
    try {
      await addAssetsToCollection(cognitoUser, currentCollection.id, [
        asset.id || asset.uuid,
      ]);
      setUpdatedAssets((prevAssets) => [...prevAssets, asset]);
      setShowAssetGrid(false);
    } catch (error) {
      console.error("Failed to add asset:", error);
    }
  };

  // Handle removing an asset (only for collection owner)
  const handleRemoveAsset = async (asset) => {
    if (!isCollectionOwner) {
      console.warn("Cannot remove assets from someone else's collection");
      return;
    }
    if (!cognitoUser?.id_token) {
      console.error("User authentication token is missing");
      return;
    }
    try {
      await removeAssetsFromCollection(cognitoUser, currentCollection.id, [
        asset.uuid,
      ]);
      setUpdatedAssets((prevAssets) =>
        prevAssets.filter((a) => (a.id || a.uuid) !== (asset.id || asset.uuid)),
      );
    } catch (error) {
      console.error("Failed to remove asset:", error);
    }
  };

  // Navigate to asset details page
  const handleAssetClick = (uuid) => {
    sessionStorage.setItem("previousPage", window.location.href);
    router.push(`/profile/${uuid}`);
  };

  // Build a shareable URL for this collection and handle share action
  const collectionUrl = `${window.location.origin}/profile?tab=collections&collectionId=${currentCollection.id}`;

  const handleShare = () => {
    if (currentCollection.visibility === "private") {
      setShareMessage(
        "This collection is private and can't be shared. Public collections can be shared.",
      );
      setShareMessageType("error");
      setTimeout(() => {
        setShareMessage("");
        setShareMessageType("");
      }, 5000);
      return;
    }
    navigator.clipboard
      .writeText(collectionUrl)
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

  // Handle delete button click (only for collection owner)
  const handleDeleteClick = () => {
    if (!isCollectionOwner) {
      console.warn("Cannot delete someone else's collection");
      return;
    }
    setShowDeleteModal(true);
  };

  // Handle delete confirmation (only for collection owner)
  const handleDeleteConfirm = async () => {
    if (!isCollectionOwner) {
      console.warn("Cannot delete someone else's collection");
      setShowDeleteModal(false);
      return;
    }
    if (!cognitoUser?.id_token) {
      console.error("User authentication token is missing");
      return;
    }
    try {
      await deleteCollectionById(cognitoUser, currentCollection.id);
      console.log("Collection deleted successfully!");
      onBack();
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
    setShowDeleteModal(false);
  };

  // Cancel delete action
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400">Loading Collection...</div>
    );
  }

  return (
    <div className={styles.container}>
      {isEditing ? (
        <EditCollectionForm
          collection={currentCollection}
          onCancel={() => setIsEditing(false)}
          onUpdate={(updatedCollection) => {
            setCurrentCollection(updatedCollection);
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <div
            className={styles.banner}
            style={{
              backgroundImage: `url(${
                currentCollection.assets?.[0]?.imageUrl ||
                "/placeholder/p02.png"
              })`,
            }}
          >
            <div className={styles.bannerOverlay}></div>
            <span className={styles.collectionName}>
              {currentCollection.name}
            </span>
          </div>

          {/* Responsive Top Section */}
          <div
            className={`${styles.topSection} flex flex-wrap items-center justify-between gap-2`}
          >
            {/* Left Side: Back button & Privacy text */}
            <div className="flex items-center gap-2">
              <button onClick={onBack} className={styles.backButton}>
                Back to Collections
              </button>
              <div className={styles.privacyText}>
                Privacy:{" "}
                {currentCollection.visibility
                  ? currentCollection.visibility.charAt(0).toUpperCase() +
                    currentCollection.visibility.slice(1)
                  : ""}
              </div>
            </div>

            {/* Right Side: Action buttons */}
            <div className="flex items-center gap-2">
              {/* Add Asset button – only for collection owner */}
              {isCollectionOwner && (
                <button
                  onClick={() => setShowAssetGrid(true)}
                  className={styles.buttonRound}
                >
                  <Plus size={20} />
                </button>
              )}

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={handleShare}
                  className={`w-10 h-10 ${styles.roundedButton} ${
                    shareMessageType === "success"
                      ? styles.bgGreenButton
                      : styles.bgGrayButton
                  }`}
                  title="Share asset"
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

              {/* More options menu – only for collection owner */}
              {isCollectionOwner && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={styles.buttonRound}
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  {menuOpen && (
                    <div className={styles.dropdownMenu}>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full text-left px-4 py-2 hover:bg-green-700 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className="w-full text-left text-red-500 px-4 py-2 hover:bg-red-700 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Asset Selection Grid – only shown for collection owner */}
          {isCollectionOwner && showAssetGrid && (
            <div className={styles.assetSelectionGrid}>
              <h3 className="text-lg font-bold">Select an Asset to Add</h3>
              {allAssets && allAssets.length > 0 ? (
                <div className={styles.assetGrid}>
                  {allAssets
                    .filter(
                      (asset) =>
                        !updatedAssets.some(
                          (collectionAsset) =>
                            (collectionAsset.uuid || collectionAsset.id) ===
                            (asset.uuid || asset.id),
                        ),
                    )
                    .map((asset) => (
                      <div
                        key={asset.uuid || asset.id}
                        className={styles.assetCard}
                        onClick={() => handleAddAsset(asset)}
                      >
                        <img src={asset.imageUrl} alt={asset.name} />
                        <h5>{asset.name}</h5>
                        <p>{asset.type}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  <br />
                  No assets yet! Time to get creative and add some treasures to
                  your library!
                  <br /> <br />
                </p>
              )}
              <button
                onClick={() => setShowAssetGrid(false)}
                className={styles.backButton}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Asset Grid – viewable by everyone */}
          <div className={styles.assetGrid}>
            {updatedAssets.map((asset) => (
              <div key={asset.id || asset.uuid} className={styles.assetCard}>
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  onClick={() => handleAssetClick(asset.uuid)}
                  style={{ cursor: "pointer" }}
                />
                <h5>{asset.name}</h5>
                <p>{asset.type}</p>
                {/* Remove button – only for collection owner */}
                {isCollectionOwner && (
                  <button
                    onClick={() => handleRemoveAsset(asset)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <DeleteModal
          collectionName={currentCollection.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}

function DeleteModal({ collectionName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-md p-6 w-80 text-center">
        <h2 className="text-xl font-bold mb-2">
          Are you sure you want to delete <br /> this collection{" "}
          <span className="text-red-600">{collectionName}</span>?
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
