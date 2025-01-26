import axios from "axios";

const DEFAULT_PROFILE_PHOTO = "/placeholder/p03.png";
const DEFAULT_ASSET_PHOTO = "/placeholder/default_asset.png";

/**
 * Fetch user information and their assets from the backend.
 * @returns {Promise<Object>} User information including profile and assets.
 */
export async function fetchUserInfo() {
  try {
    const response = await axios.get("/api/user", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Adjust based on your auth logic
      },
    });

    const user = response.data;

    // Ensure profile photo and asset images have fallbacks
    return {
      ...user,
      profilePhoto: user.profilePhoto || DEFAULT_PROFILE_PHOTO,
      assets: (user.assets || []).map((asset) => ({
        ...asset,
        image: asset.image || DEFAULT_ASSET_PHOTO,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch user information:", error);
    throw error;
  }
}
