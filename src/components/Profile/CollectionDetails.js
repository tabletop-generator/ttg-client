/* eslint-disable @next/next/no-img-element */
import { addAssetsToCollection, removeAssetsFromCollection } from "@/api";
import EditCollectionForm from "@/components/Profile/EditCollectionForm";
import styles from "@/styles/CollectionDetails.module.css";
import { MoreHorizontal, Plus, Share2, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
export default function CollectionDetails({
  collection,
  userCollections,
  onBack,
  allAssets,
}) {
  const auth = useAuth();
  const cognitoUser = auth.user;
  const router = useRouter();
  const [showAssetGrid, setShowAssetGrid] = useState(false);
  const [updatedAssets, setUpdatedAssets] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const dropdownRef = useRef(null);
  const [currentCollection, setCurrentCollection] = useState(collection);

  const handleAssetClick = (uuid) => {
    console.log("Clicked Asset UUID:", uuid);
    router.push(`/profile/${uuid}`); //Navigate to Asset Details
  };

  useEffect(() => {
    // Find the updated collection in `userCollections`
    const updatedCollection = userCollections?.find(
      (c) => c.id === collection.id,
    );

    console.log("Updated userCollections:", userCollections);

    if (updatedCollection) {
      setCurrentCollection(updatedCollection);
      setUpdatedAssets(updatedCollection.assets || []);
    }
  }, [userCollections, collection.id]);

  // Ensures `updatedAssets` syncs with `currentCollection`
  useEffect(() => {
    setUpdatedAssets(currentCollection.assets || []);
  }, [currentCollection.assets]);

  // Uses first asset image or fallback
  const backgroundImageUrl =
    currentCollection.assets?.[0]?.imageUrl || "/placeholder/p02.png";

  // Handles adding an asset and updates the UI
  const handleAddAsset = async (asset) => {
    if (!cognitoUser?.id_token) {
      console.error("User authentication token is missing");
      return;
    }

    if (!asset.id && !asset.uuid) {
      console.error("Asset is missing an ID or UUID:", asset);
      return;
    }

    try {
      await addAssetsToCollection(cognitoUser, currentCollection.id, [
        asset.id || asset.uuid,
      ]);

      // Update local assets list
      setUpdatedAssets((prevAssets) => [...prevAssets, asset]);
      setShowAssetGrid(false);
    } catch (error) {
      console.error("Failed to add asset:", error);
    }
  };

  // Handles removing an asset and updates the UI
  const handleRemoveAsset = async (asset) => {
    if (!cognitoUser?.id_token) {
      console.error("User authentication token is missing");
      return;
    }

    if (!asset.id && !asset.uuid) {
      console.error("Asset is missing an ID or UUID:", asset);
      return;
    }

    try {
      await removeAssetsFromCollection(cognitoUser, currentCollection.id, [
        asset.id || asset.uuid,
      ]);

      // Update local assets list
      setUpdatedAssets((prevAssets) =>
        prevAssets.filter((a) => a.id !== asset.id && a.uuid !== asset.uuid),
      );
    } catch (error) {
      console.error("Failed to remove asset:", error);
    }
  };

  // Set the asset to be deleted and show the confirmation modal
  const handleRemoveAssetWithConfirmation = (asset) => {
    setAssetToDelete(asset);
    setShowDeleteModal(true);
  };

  // Called when the user confirms deletion
  const handleDeleteConfirm = async () => {
    if (assetToDelete) {
      await handleRemoveAsset(assetToDelete);
      console.log("Asset deleted successfully!");
    }
    setShowDeleteModal(false);
    setAssetToDelete(null);
  };

  // Called when the user cancels deletion
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAssetToDelete(null);
  };

  return (
    <div className={styles.container}>
      {isEditing && (
        <EditCollectionForm
          collection={currentCollection}
          onCancel={() => setIsEditing(false)}
          onUpdate={(updatedCollection) => {
            setCurrentCollection(updatedCollection);
            setIsEditing(false);
          }}
        />
      )}

      <div
        className={styles.banner}
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className={styles.bannerOverlay}></div>
        <span className={styles.collectionName}>{currentCollection.name}</span>
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
          <button
            onClick={() => setShowAssetGrid(true)}
            className={styles.buttonRound}
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className={copied ? styles.buttonCopied : styles.buttonRound}
          >
            <Share2 size={20} />
          </button>
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
                  onClick={() => {
                    setIsEditing(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-green-700 text-white"
                >
                  Edit
                </button>
                <button className="w-full text-left text-red-500 px-4 py-2 hover:bg-red-700 hover:text-white">
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAssetGrid && (
        <div className={styles.assetSelectionGrid}>
          <h3 className="text-lg font-bold">Select an Asset to Add</h3>
          <button
            onClick={() => setShowAssetGrid(false)}
            className={styles.backButton}
          >
            Cancel
          </button>
          <div className={styles.assetGrid}>
            {allAssets.map((asset) => (
              <div
                key={asset.id || asset.uuid}
                className={styles.assetCard}
                onClick={() => handleAddAsset(asset)}
              >
                <img src={asset.imageUrl} alt={asset.name} />
                <h5>{asset.name}</h5>
                <p>{asset.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
            <button
              onClick={() => handleRemoveAssetWithConfirmation(asset)}
              className="text-red-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Render the Delete Modal */}
      {showDeleteModal && assetToDelete && (
        <DeleteModal
          assetName={assetToDelete.name}
          collectionName={currentCollection.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}

// DeleteModal Component
function DeleteModal({ assetName, collectionName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-md p-6 w-80 text-center">
        <h2 className="text-xl font-bold mb-2">
          Are you sure you want to remove <br />
          <span className="text-red-600">{assetName}</span> from{" "}
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
