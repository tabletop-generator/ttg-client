// Updated CollectionDetails.js - Key sections modified for ownership check
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
  isOwnProfile = true, // Add isOwnProfile prop with default true for backward compatibility
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

  // Check if the current user owns this collection
  // Either through the isOwnProfile prop or by comparing owner IDs
  const isCollectionOwner =
    isOwnProfile ||
    user?.hashedEmail === ownerId ||
    user?.hashedEmail === collection?.ownerId;

  // Combine both user objects, ensuring the token is under 'id_token'
  const combinedUser =
    user && cognitoUser
      ? {
          ...user,
          id_token: cognitoUser.id_token,
        }
      : null;

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

          const fetchedOwnerId = collectionData.ownerId;
          setOwnerId(fetchedOwnerId);

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

  // Handle adding an asset to the collection - only available to collection owner
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

  // Handle removing an asset from the collection - only available to collection owner
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

  // Handle clicking an asset to navigate to its detail page
  const handleAssetClick = (uuid) => {
    sessionStorage.setItem("previousPage", window.location.href);
    router.push(`/profile/${uuid}`);
  };

  // Handle share functionality
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

    // Create a URL object from the current URL
    const currentUrl = new URL(window.location.href);
    // Set or update the "collectionId" query parameter
    currentUrl.searchParams.set("collectionId", currentCollection.id);

    navigator.clipboard
      .writeText(currentUrl.toString())
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

  // Handle delete button click to show modal - only available to collection owner
  const handleDeleteClick = () => {
    if (!isCollectionOwner) {
      console.warn("Cannot delete someone else's collection");
      return;
    }

    setShowDeleteModal(true);
  };

  // Handle delete confirmation - only available to collection owner
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
      onBack(); // Navigate back to collections
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
    setShowDeleteModal(false);
  };

  // Handle delete cancel
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

          <div className={styles.topSection}>
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
            <div className={styles.rightButtons}>
              {/* Add Asset button - Only show for collection owner */}
              {isCollectionOwner && (
                <button
                  onClick={() => setShowAssetGrid(true)}
                  className={styles.buttonRound}
                >
                  <Plus size={20} />
                </button>
              )}

              {/* Share button - Available to everyone */}
              <button
                onClick={handleShare}
                className={copied ? styles.buttonCopied : styles.buttonRound}
              >
                <Share2 size={20} />
              </button>

              {/* Share message/confirmation */}
              {shareMessage && (
                <div
                  className={
                    shareMessageType === "error"
                      ? styles.errorMessage
                      : styles.successMessage
                  }
                >
                  {shareMessage}
                </div>
              )}

              {/* More options menu - Only show for collection owner */}
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

          {/* Asset Selection Grid - Only shown for collection owner */}
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
                        {/* eslint-disable-next-line @next/next/no-img-element */}
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

          {/* Asset Grid - Viewable by everyone */}
          <div className={styles.assetGrid}>
            {updatedAssets.map((asset) => (
              <div key={asset.id || asset.uuid} className={styles.assetCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  onClick={() => handleAssetClick(asset.uuid)}
                  style={{ cursor: "pointer" }}
                />
                <h5>{asset.name}</h5>
                <p>{asset.type}</p>
                {/* Remove button - Only show for collection owner */}
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

function DeleteModal({ assetName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-md p-6 w-80 text-center">
        <h2 className="text-xl font-bold mb-2">
          Are you sure you want to delete <br /> this collection
          <span className="text-red-600">{assetName}</span>?
        </h2>
        <p className="mb-4">This action can&apos;t be undone!</p>
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
